import { PrismaClient } from '@prisma/client';

process.env.NODE_ENV = 'test';

declare global {
  // eslint-disable-next-line no-var
  var testUtils: {
    prisma: PrismaClient;
  };
}

// Initialize Prisma for tests
export const prisma = new PrismaClient();

// Setup
beforeAll(async () => {
  console.log('🧪 Setting up test environment...');
});

// Cleanup
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...');
  await prisma.$disconnect();
});

// Global test utilities
global.testUtils = {
  prisma,
};

export {};
