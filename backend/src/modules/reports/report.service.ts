import { prisma } from "../../lib/prisma";

interface Range {
  from?: string;
  to?: string;
}

function dateFilter(range: Range) {
  return {
    gte: range.from ? new Date(range.from) : undefined,
    lte: range.to ? new Date(range.to) : undefined,
  };
}

export async function getSummary(restaurantId: string, range: Range) {
  const invoices = await prisma.invoice.findMany({
    where: { restaurantId, createdAt: dateFilter(range) },
    select: { total: true },
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const invoiceCount = invoices.length;
  const averageTicket = invoiceCount > 0 ? totalRevenue / invoiceCount : 0;

  return { totalRevenue, invoiceCount, averageTicket };
}

function bucketKey(date: Date, groupBy: "day" | "week" | "month"): string {
  if (groupBy === "month") {
    return date.toISOString().slice(0, 7); // YYYY-MM
  }
  if (groupBy === "week") {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayOfWeek = d.getUTCDay() || 7; // lunes=1 ... domingo=7
    d.setUTCDate(d.getUTCDate() - (dayOfWeek - 1)); // retrocede al lunes de esa semana
    return d.toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function getSalesSeries(restaurantId: string, range: Range, groupBy: "day" | "week" | "month") {
  const invoices = await prisma.invoice.findMany({
    where: { restaurantId, createdAt: dateFilter(range) },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const buckets = new Map<string, { period: string; revenue: number; invoiceCount: number }>();

  for (const invoice of invoices) {
    const key = bucketKey(invoice.createdAt, groupBy);
    const bucket = buckets.get(key) ?? { period: key, revenue: 0, invoiceCount: 0 };
    bucket.revenue += invoice.total;
    bucket.invoiceCount += 1;
    buckets.set(key, bucket);
  }

  return Array.from(buckets.values()).sort((a, b) => a.period.localeCompare(b.period));
}

export async function getTopItems(restaurantId: string, range: Range, limit: number) {
  const orderItems = await prisma.orderItem.findMany({
    where: {
      restaurantId,
      order: { invoice: { createdAt: dateFilter(range) } },
    },
    select: { menuItemId: true, quantity: true, unitPrice: true, menuItem: { select: { name: true } } },
  });

  const totals = new Map<string, { menuItemId: string; name: string; quantity: number; revenue: number }>();

  for (const item of orderItems) {
    const entry = totals.get(item.menuItemId) ?? {
      menuItemId: item.menuItemId,
      name: item.menuItem.name,
      quantity: 0,
      revenue: 0,
    };
    entry.quantity += item.quantity;
    entry.revenue += item.unitPrice * item.quantity;
    totals.set(item.menuItemId, entry);
  }

  return Array.from(totals.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}
