import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with essential data...');

  // Create Spektif Agency organization
  const organization = await prisma.organization.upsert({
    where: { id: 'spektif-agency' },
    update: {},
    create: {
      id: 'spektif-agency',
      name: 'Spektif Agency',
      slug: 'spektif-agency',
      description: 'Digital agency providing modern web solutions',
    },
  });

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@spektif.com' },
    update: {},
    create: {
      name: 'Spektif Admin',
      email: 'admin@spektif.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create organization member
  await prisma.orgMember.upsert({
    where: { 
      userId_orgId: {
        userId: admin.id,
        orgId: organization.id
      }
    },
    update: {},
    create: {
      userId: admin.id,
      orgId: organization.id,
      role: 'ADMIN',
    },
  });

  // Create a simple board
  const board = await prisma.board.create({
    data: {
      title: 'Spektif Projects',
      description: 'Main project management board',
      organizationId: organization.id,
      createdBy: admin.id,
    },
  });

  // Create board member
  await prisma.boardMember.create({
    data: {
      boardId: board.id,
      userId: admin.id,
      role: 'ADMIN',
    },
  });

  // Create a simple list
  const todoList = await prisma.list.create({
    data: {
      title: 'To Do',
      boardId: board.id,
      position: 1,
    },
  });

  // Create a simple card
  await prisma.card.create({
    data: {
      title: 'Welcome to Spektif Agency',
      description: 'This is your first task card!',
      listId: todoList.id,
      position: 1,
      priority: 'MEDIUM',
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('🔐 Login credentials:');
  console.log('   Email: admin@spektif.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
