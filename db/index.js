const { PrismaClient } = require('@prisma/client');

let prisma;

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Use a global variable for Prisma client in development to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = prismaClientSingleton();
  }
  prisma = global.prisma;
} else {
  prisma = prismaClientSingleton();
}

module.exports = prisma;
