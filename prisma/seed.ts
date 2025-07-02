import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { username: "boss" },
    update: {},
    create: {
      username: "boss",
      password: await bcrypt.hash("boss123", 10),
      name: "Boss",
      role: Role.BOSS,
    },
  });

  console.log("✅ Admin and Boss users created!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
