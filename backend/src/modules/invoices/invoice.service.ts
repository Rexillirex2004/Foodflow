import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { CreateInvoiceInput } from "./invoice.validation";

const INVOICE_INCLUDE = {
  order: { include: { items: { include: { menuItem: true } }, table: true } },
  cashier: { select: { id: true, name: true } },
} as const;

export async function createInvoice(restaurantId: string, cashierId: string, input: CreateInvoiceInput) {
  const order = await prisma.order.findFirst({
    where: { id: input.orderId, restaurantId },
    include: { items: true, invoice: true },
  });

  if (!order) throw ApiError.notFound("Pedido no encontrado");
  if (order.invoice) throw ApiError.conflict("Este pedido ya fue facturado");
  if (order.status !== "READY" && order.status !== "SERVED") {
    throw ApiError.conflict("El pedido debe estar listo o servido antes de facturarlo");
  }
  if (order.items.length === 0) {
    throw ApiError.conflict("El pedido no tiene ítems");
  }

  const restaurant = await prisma.restaurant.findUniqueOrThrow({ where: { id: restaurantId } });

  const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxAmount = subtotal * restaurant.taxRate;
  const total = subtotal + taxAmount + input.tipAmount;

  const lastInvoice = await prisma.invoice.findFirst({
    where: { restaurantId },
    orderBy: { invoiceNumber: "desc" },
  });
  const invoiceNumber = (lastInvoice?.invoiceNumber ?? 0) + 1;

  const [invoice] = await prisma.$transaction([
    prisma.invoice.create({
      data: {
        restaurantId,
        orderId: order.id,
        invoiceNumber,
        cashierId,
        subtotal,
        taxRate: restaurant.taxRate,
        taxAmount,
        tipAmount: input.tipAmount,
        total,
        paymentMethod: input.paymentMethod,
      },
      include: INVOICE_INCLUDE,
    }),
    prisma.order.update({ where: { id: order.id }, data: { status: "CLOSED", closedAt: new Date() } }),
    prisma.table.update({ where: { id: order.tableId }, data: { status: "FREE" } }),
  ]);

  return invoice;
}

export function listInvoices(restaurantId: string, filters: { from?: string; to?: string }) {
  return prisma.invoice.findMany({
    where: {
      restaurantId,
      createdAt: {
        gte: filters.from ? new Date(filters.from) : undefined,
        lte: filters.to ? new Date(filters.to) : undefined,
      },
    },
    include: INVOICE_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function getInvoice(restaurantId: string, id: string) {
  const invoice = await prisma.invoice.findFirst({ where: { id, restaurantId }, include: INVOICE_INCLUDE });
  if (!invoice) throw ApiError.notFound("Factura no encontrada");
  return invoice;
}
