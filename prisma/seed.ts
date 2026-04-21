import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@webdevorg.com";
  const password = process.env.ADMIN_PASSWORD ?? "Admin@123";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: await bcrypt.hash(password, 10),
      role: "ADMIN",
      approved: true
    }
  });
}

main().finally(() => prisma.$disconnect());
