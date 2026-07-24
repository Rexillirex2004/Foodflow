import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Role } from "../src/types/enums";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo1234!";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const restaurant = await prisma.restaurant.upsert({
    where: { id: "demo-restaurant" },
    update: {},
    create: {
      id: "demo-restaurant",
      name: "FoodFlow Demo Restaurante",
      address: "Calle Principal 123",
      phone: "555-0100",
      taxRate: 0.13,
    },
  });

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  await prisma.subscription.upsert({
    where: { restaurantId: restaurant.id },
    update: {},
    create: {
      restaurantId: restaurant.id,
      status: "TRIAL",
      trialEndsAt,
    },
  });

  const staff: { email: string; name: string; role: Role }[] = [
    { email: "owner@foodflow.demo", name: "Ana Dueña", role: "OWNER" },
    { email: "mesero@foodflow.demo", name: "Luis Mesero", role: "WAITER" },
    { email: "cajero@foodflow.demo", name: "Carla Cajera", role: "CASHIER" },
    { email: "cocina@foodflow.demo", name: "Pedro Cocina", role: "KITCHEN" },
  ];

  for (const person of staff) {
    await prisma.user.upsert({
      where: { email: person.email },
      update: {},
      create: {
        restaurantId: restaurant.id,
        email: person.email,
        name: person.name,
        role: person.role,
        passwordHash,
      },
    });
  }

  const categoriesData = [
    {
      name: "Entradas",
      items: [
        { name: "Sopa de Tortilla", price: 4.5, description: "Sopa de tomate con tortilla crujiente" },
        { name: "Nachos Clásicos", price: 5.9, description: "Totopos con queso fundido y jalapeños" },
      ],
    },
    {
      name: "Platos Fuertes",
      items: [
        { name: "Hamburguesa Clásica", price: 8.9, description: "Carne, queso, lechuga y tomate" },
        { name: "Pechuga a la Plancha", price: 9.5, description: "Con guarnición de vegetales" },
        { name: "Pasta Alfredo", price: 8.2, description: "Fetuccini en salsa cremosa" },
        { name: "Tacos al Pastor (3u)", price: 7.5, description: "Con piña, cilantro y cebolla" },
      ],
    },
    {
      name: "Bebidas",
      items: [
        { name: "Limonada", price: 2.5, description: "Natural, endulzada al gusto" },
        { name: "Refresco", price: 2.0, description: "Lata 355ml" },
        { name: "Café Americano", price: 1.8, description: "Recién hecho" },
      ],
    },
    {
      name: "Postres",
      items: [
        { name: "Flan Casero", price: 3.5, description: "Con caramelo" },
        { name: "Pastel de Chocolate", price: 4.0, description: "Porción individual" },
      ],
    },
  ];

  for (let i = 0; i < categoriesData.length; i++) {
    const cat = categoriesData[i];
    const category = await prisma.menuCategory.upsert({
      where: { id: `demo-category-${i}` },
      update: {},
      create: {
        id: `demo-category-${i}`,
        restaurantId: restaurant.id,
        name: cat.name,
        sortOrder: i,
      },
    });

    for (let j = 0; j < cat.items.length; j++) {
      const item = cat.items[j];
      await prisma.menuItem.upsert({
        where: { id: `demo-item-${i}-${j}` },
        update: {},
        create: {
          id: `demo-item-${i}-${j}`,
          restaurantId: restaurant.id,
          categoryId: category.id,
          name: item.name,
          description: item.description,
          price: item.price,
          available: true,
        },
      });
    }
  }

  for (let n = 1; n <= 6; n++) {
    await prisma.table.upsert({
      where: { restaurantId_name: { restaurantId: restaurant.id, name: `Mesa ${n}` } },
      update: {},
      create: {
        restaurantId: restaurant.id,
        name: `Mesa ${n}`,
        capacity: n % 2 === 0 ? 4 : 2,
        status: "FREE",
      },
    });
  }

  console.log("\nSeed completo. Credenciales de prueba (misma contraseña para todos):\n");
  for (const person of staff) {
    console.log(`  ${person.role.padEnd(8)} -> ${person.email} / ${DEMO_PASSWORD}`);
  }
  console.log("");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
