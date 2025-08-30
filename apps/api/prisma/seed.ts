import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Spektif Agency organization
  const organization = await prisma.organization.upsert({
    where: { id: 'spektif-agency' },
    update: {},
    create: {
      id: 'spektif-agency',
      name: 'Spektif Agency',
      branding: JSON.stringify({
        primaryColor: '#4ADE80',
        secondaryColor: '#000000',
        logo: '/spektif-logo.png',
      }),
      subscriptionStatus: 'ACTIVE',
    },
  });

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 12);
  const employeePassword = await bcrypt.hash('employee123', 12);
  const accountantPassword = await bcrypt.hash('accountant123', 12);
  const clientPassword = await bcrypt.hash('client123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@spektif.com' },
    update: {},
    create: {
      name: 'Spektif Admin',
      email: 'admin@spektif.com',
      password: adminPassword,
    },
  });

  const employee1 = await prisma.user.upsert({
    where: { email: 'ahmet@spektif.com' },
    update: {},
    create: {
      name: 'Ahmet Yılmaz',
      email: 'ahmet@spektif.com',
      password: employeePassword,
    },
  });

  const employee2 = await prisma.user.upsert({
    where: { email: 'elif@spektif.com' },
    update: {},
    create: {
      name: 'Elif Kaya',
      email: 'elif@spektif.com',
      password: employeePassword,
    },
  });

  const accountant = await prisma.user.upsert({
    where: { email: 'muhasebe@spektif.com' },
    update: {},
    create: {
      name: 'Mehmet Muhasebe',
      email: 'muhasebe@spektif.com',
      password: accountantPassword,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'Müşteri Firması',
      email: 'client@example.com',
      password: clientPassword,
    },
  });

  // Create organization memberships
  await prisma.orgMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: admin.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: admin.id,
      role: 'ADMIN',
    },
  });

  await prisma.orgMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: employee1.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: employee1.id,
      role: 'EMPLOYEE',
    },
  });

  await prisma.orgMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: employee2.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: employee2.id,
      role: 'EMPLOYEE',
    },
  });

  await prisma.orgMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: accountant.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: accountant.id,
      role: 'ACCOUNTANT',
    },
  });

  await prisma.orgMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: client.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: client.id,
      role: 'CLIENT',
    },
  });

  // Create sample board
  const board = await prisma.board.upsert({
    where: { id: 'sample-board' },
    update: {},
    create: {
      id: 'sample-board',
      organizationId: organization.id,
      title: 'Sosyal Medya Projeleri',
      description: 'Müşteri projelerini takip etmek için kullanılan ana board',
      color: '#4ADE80',
    },
  });

  // Create board memberships
  await prisma.boardMember.upsert({
    where: {
      boardId_userId: {
        boardId: board.id,
        userId: admin.id,
      },
    },
    update: {},
    create: {
      boardId: board.id,
      userId: admin.id,
      role: 'ADMIN',
    },
  });

  await prisma.boardMember.upsert({
    where: {
      boardId_userId: {
        boardId: board.id,
        userId: employee1.id,
      },
    },
    update: {},
    create: {
      boardId: board.id,
      userId: employee1.id,
      role: 'EDITOR',
    },
  });

  await prisma.boardMember.upsert({
    where: {
      boardId_userId: {
        boardId: board.id,
        userId: client.id,
      },
    },
    update: {},
    create: {
      boardId: board.id,
      userId: client.id,
      role: 'CLIENT_VIEW',
    },
  });

  // Create lists
  const yapilacakList = await prisma.list.upsert({
    where: { id: 'yapilacak-list' },
    update: {},
    create: {
      id: 'yapilacak-list',
      boardId: board.id,
      title: 'Yapılacak',
      order: 1,
    },
  });

  const devamList = await prisma.list.upsert({
    where: { id: 'devam-list' },
    update: {},
    create: {
      id: 'devam-list',
      boardId: board.id,
      title: 'Devam Ediyor',
      order: 2,
    },
  });

  const bittiList = await prisma.list.upsert({
    where: { id: 'bitti-list' },
    update: {},
    create: {
      id: 'bitti-list',
      boardId: board.id,
      title: 'Bitti',
      order: 3,
    },
  });

  // Create sample cards
  const card1 = await prisma.card.upsert({
    where: { id: 'card-1' },
    update: {},
    create: {
      id: 'card-1',
      listId: yapilacakList.id,
      title: 'Instagram Stories Tasarımı',
      description: 'Müşteri için haftalık Instagram stories tasarımları hazırlanacak',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      order: 1,
      createdBy: admin.id,
    },
  });

  const card2 = await prisma.card.upsert({
    where: { id: 'card-2' },
    update: {},
    create: {
      id: 'card-2',
      listId: devamList.id,
      title: 'Website Analiz Raporu',
      description: 'Google Analytics ve sosyal medya performans raporu hazırlanıyor',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      order: 1,
      createdBy: employee1.id,
    },
  });

  const card3 = await prisma.card.upsert({
    where: { id: 'card-3' },
    update: {},
    create: {
      id: 'card-3',
      listId: bittiList.id,
      title: 'Facebook Reklam Kampanyası',
      description: 'Q4 hedefleri için Facebook reklam kampanyası başarıyla tamamlandı',
      order: 1,
      createdBy: employee2.id,
    },
  });

  // Add card members
  await prisma.cardMember.upsert({
    where: {
      cardId_userId: {
        cardId: card1.id,
        userId: client.id,
      },
    },
    update: {},
    create: {
      cardId: card1.id,
      userId: client.id,
    },
  });

  await prisma.cardMember.upsert({
    where: {
      cardId_userId: {
        cardId: card2.id,
        userId: client.id,
      },
    },
    update: {},
    create: {
      cardId: card2.id,
      userId: client.id,
    },
  });

  // Create subscription
  await prisma.subscription.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      plan: 'Pro Plan',
      price: 149900, // 1499 TL in kuruş
      status: 'PAST_DUE', // To demonstrate paywall
      currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Create past due invoice
  await prisma.invoice.upsert({
    where: { id: 'invoice-1' },
    update: {},
    create: {
      id: 'invoice-1',
      organizationId: organization.id,
      month: '2024-12',
      amount: 149900,
      status: 'OVERDUE',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  // Create sample expenses
  await prisma.expense.create({
    data: {
      organizationId: organization.id,
      category: 'Yazılım',
      vendor: 'Adobe Creative Cloud',
      amount: 89900, // 899 TL
      date: new Date(),
      note: 'Aylık tasarım yazılımı aboneliği',
    },
  });

  await prisma.expense.create({
    data: {
      organizationId: organization.id,
      category: 'Ofis',
      vendor: 'Kahve Dünyası',
      amount: 25000, // 250 TL
      date: new Date(),
      note: 'Ofis için kahve ve çay alımı',
    },
  });

  // Create sample salaries
  await prisma.salary.create({
    data: {
      organizationId: organization.id,
      userId: employee1.id,
      amount: 1500000, // 15,000 TL
      period: '2024-12',
      startDate: new Date('2024-01-01'),
    },
  });

  await prisma.salary.create({
    data: {
      organizationId: organization.id,
      userId: employee2.id,
      amount: 1400000, // 14,000 TL
      period: '2024-12',
      startDate: new Date('2024-03-01'),
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('📧 Demo accounts:');
  console.log('   Admin: admin@spektif.com / admin123');
  console.log('   Employee: ahmet@spektif.com / employee123');
  console.log('   Accountant: muhasebe@spektif.com / accountant123');
  console.log('   Client: client@example.com / client123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
