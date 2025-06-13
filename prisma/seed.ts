import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cyberguard.com' },
    update: {},
    create: {
      email: 'admin@cyberguard.com',
      password: hashedPassword,
      name: 'Admin CyberGuard',
      role: 'admin',
      avatar: 'https://api.cyberguard.com/uploads/avatars/admin.jpg'
    }
  });

  console.log('Admin user created:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });