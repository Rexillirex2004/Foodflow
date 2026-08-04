import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { OrderStatus, Role } from "../../types/enums";
import { AddOrderItemInput, CreateOrderInput, UpdateOrderItemInput } from "./order.validation";

const ORDER_INCLUDE = {
  items: { include: { menuItem: true } },
  table: true,
  waiter: { select: { id: true, name: true } },
} as const;

export function listOrders(restaurantId: string, filters: { status?: OrderStatus; tableId?: string }) {
  return prisma.order.findMany({
    where: { restaurantId, ...filters },
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrder(restaurantId: string, id: string) {
  const order = await prisma.order.findFirst({ where: { id, restaurantId }, include: ORDER_INCLUDE });
  if (!order) throw ApiError.notFound("Pedido no encontrado");
  return order;
}

export async function createOrder(restaurantId: string, waiterId: string, input: CreateOrderInput) {
  const table = await prisma.table.findFirst({ where: { id: input.tableId, restaurantId } });
  if (!table) throw ApiError.notFound("Mesa no encontrada");

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: { restaurantId, tableId: table.id, waiterId, notes: input.notes },
      include: ORDER_INCLUDE,
    }),
    prisma.table.update({ where: { id: table.id }, data: { status: "OCCUPIED" } }),
  ]);

  return order;
}

async function findOpenOrder(restaurantId: string, orderId: string) {
  const order = await prisma.order.findFirst({ where: { id: orderId, restaurantId } });
  if (!order) throw ApiError.notFound("Pedido no encontrado");
  if (order.status !== "OPEN") {
    throw ApiError.conflict("Solo se pueden modificar los ítems mientras el pedido está abierto");
  }
  return order;
}

export async function addOrderItem(restaurantId: string, orderId: string, input: AddOrderItemInput) {
  await findOpenOrder(restaurantId, orderId);

  const menuItem = await prisma.menuItem.findFirst({ where: { id: input.menuItemId, restaurantId } });
  if (!menuItem) throw ApiError.notFound("Plato no encontrado");
  if (!menuItem.available) throw ApiError.conflict("Este plato no está disponible");

  await prisma.orderItem.create({
    data: {
      restaurantId,
      orderId,
      menuItemId: menuItem.id,
      quantity: input.quantity,
      unitPrice: menuItem.price,
      notes: input.notes,
    },
  });

  return getOrder(restaurantId, orderId);
}

export async function updateOrderItem(
  restaurantId: string,
  orderId: string,
  itemId: string,
  input: UpdateOrderItemInput
) {
  await findOpenOrder(restaurantId, orderId);

  const item = await prisma.orderItem.findFirst({ where: { id: itemId, orderId, restaurantId } });
  if (!item) throw ApiError.notFound("Ítem no encontrado en el pedido");

  await prisma.orderItem.update({ where: { id: itemId }, data: input });

  return getOrder(restaurantId, orderId);
}

export async function removeOrderItem(restaurantId: string, orderId: string, itemId: string) {
  await findOpenOrder(restaurantId, orderId);

  const item = await prisma.orderItem.findFirst({ where: { id: itemId, orderId, restaurantId } });
  if (!item) throw ApiError.notFound("Ítem no encontrado en el pedido");

  await prisma.orderItem.delete({ where: { id: itemId } });

  return getOrder(restaurantId, orderId);
}

const TRANSITIONS: Record<OrderStatus, { to: OrderStatus; allowedRoles: Role[] }[]> = {
  OPEN: [
    { to: "IN_PROGRESS", allowedRoles: ["WAITER", "OWNER", "ADMIN"] },
    { to: "CANCELLED", allowedRoles: ["OWNER", "ADMIN", "WAITER"] },
  ],
  IN_PROGRESS: [
    { to: "READY", allowedRoles: ["KITCHEN", "OWNER", "ADMIN"] },
    { to: "CANCELLED", allowedRoles: ["OWNER", "ADMIN"] },
  ],
  READY: [
    { to: "SERVED", allowedRoles: ["WAITER", "OWNER", "ADMIN"] },
    { to: "CANCELLED", allowedRoles: ["OWNER", "ADMIN"] },
  ],
  SERVED: [{ to: "CANCELLED", allowedRoles: ["OWNER", "ADMIN"] }],
  CLOSED: [],
  CANCELLED: [],
};

export async function updateOrderStatus(
  restaurantId: string,
  orderId: string,
  role: Role,
  nextStatus: OrderStatus
) {
  const order = await prisma.order.findFirst({ where: { id: orderId, restaurantId } });
  if (!order) throw ApiError.notFound("Pedido no encontrado");

  const allowed = TRANSITIONS[order.status as OrderStatus].find((t) => t.to === nextStatus);
  if (!allowed) {
    throw ApiError.badRequest(`No se puede pasar de ${order.status} a ${nextStatus}`);
  }
  if (!allowed.allowedRoles.includes(role)) {
    throw ApiError.forbidden();
  }

  const orderItemsUpdate = prisma.order.update({
    where: { id: orderId },
    data: { status: nextStatus, closedAt: nextStatus === "CANCELLED" ? new Date() : undefined },
  });

  if (nextStatus === "CANCELLED") {
    await prisma.$transaction([
      orderItemsUpdate,
      prisma.table.update({ where: { id: order.tableId }, data: { status: "FREE" } }),
    ]);
  } else {
    await orderItemsUpdate;
  }

  return getOrder(restaurantId, orderId);
}
