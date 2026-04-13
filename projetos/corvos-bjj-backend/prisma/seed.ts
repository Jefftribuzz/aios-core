import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed idempotente: garante execução repetida sem erro por duplicidade.
  // Isso permite subir o fullstack em ambiente limpo e reaplicar seed com segurança.

  // Create or update admin user
  const hashedPassword = await bcrypt.hash('admin123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@corvosbjj.com' },
    create: {
      email: 'admin@corvosbjj.com',
      name: 'Admin Corvos',
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
    },
    update: {
      name: 'Admin Corvos',
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
    },
  });

  // Create or update professor user
  const professorPassword = await bcrypt.hash('professor123456', 10);
  const professor = await prisma.user.upsert({
    where: { email: 'professor@corvosbjj.com' },
    create: {
      email: 'professor@corvosbjj.com',
      name: 'Professor João',
      passwordHash: professorPassword,
      role: 'professor',
      isActive: true,
    },
    update: {
      name: 'Professor João',
      passwordHash: professorPassword,
      role: 'professor',
      isActive: true,
    },
  });

  // Create sample students if not present
  const existingStudent1 = await prisma.student.findFirst({
    where: { email: 'joao@email.com' },
  });

  const student1 = existingStudent1
    ? await prisma.student.update({
        where: { id: existingStudent1.id },
        data: {
          name: 'João Silva',
          phone: '11999999999',
          dateOfBirth: new Date('2000-01-15'),
          status: 'ativo',
        },
      })
    : await prisma.student.create({
        data: {
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '11999999999',
          dateOfBirth: new Date('2000-01-15'),
          startDate: new Date('2024-01-15'),
          status: 'ativo',
          createdById: professor.id,
        },
      });

  const existingStudent2 = await prisma.student.findFirst({
    where: { email: 'maria@email.com' },
  });

  const student2 = existingStudent2
    ? await prisma.student.update({
        where: { id: existingStudent2.id },
        data: {
          name: 'Maria Santos',
          phone: '11988888888',
          dateOfBirth: new Date('2002-05-20'),
          status: 'ativo',
        },
      })
    : await prisma.student.create({
        data: {
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '11988888888',
          dateOfBirth: new Date('2002-05-20'),
          startDate: new Date('2024-02-10'),
          status: 'ativo',
          createdById: professor.id,
        },
      });

  // Create sample grade once
  const existingGrade = await prisma.grade.findFirst({
    where: {
      studentId: student1.id,
      beltColor: 'branca',
      promotionDate: new Date('2024-01-15'),
    },
  });

  if (!existingGrade) {
    await prisma.grade.create({
      data: {
        studentId: student1.id,
        beltColor: 'branca',
        promotionDate: new Date('2024-01-15'),
        notes: 'Primeira faixa',
        promotedById: professor.id,
      },
    });
  }

  // Create or update sample payments
  await prisma.payment.upsert({
    where: {
      studentId_referenceMonth: {
        studentId: student1.id,
        referenceMonth: '2024-03',
      },
    },
    create: {
      studentId: student1.id,
      amount: 150.0,
      dueDate: new Date('2024-03-05'),
      paymentDate: new Date('2024-03-10'),
      status: 'pago',
      paymentMethod: 'pix',
      referenceMonth: '2024-03',
      recordedById: professor.id,
    },
    update: {
      amount: 150.0,
      dueDate: new Date('2024-03-05'),
      paymentDate: new Date('2024-03-10'),
      status: 'pago',
      paymentMethod: 'pix',
      recordedById: professor.id,
    },
  });

  await prisma.payment.upsert({
    where: {
      studentId_referenceMonth: {
        studentId: student2.id,
        referenceMonth: '2024-03',
      },
    },
    create: {
      studentId: student2.id,
      amount: 150.0,
      dueDate: new Date('2024-03-05'),
      status: 'pendente',
      referenceMonth: '2024-03',
      recordedById: professor.id,
    },
    update: {
      amount: 150.0,
      dueDate: new Date('2024-03-05'),
      status: 'pendente',
      recordedById: professor.id,
    },
  });

  console.log('✅ Database seeded successfully');
  console.log(`- Admin user: admin@corvosbjj.com / admin123456`);
  console.log(`- Professor user: professor@corvosbjj.com / professor123456`);
  console.log(`- ${2} students created`);
  console.log(`- ${2} payments created`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
