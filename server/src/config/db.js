import prisma from "../prisma/prismaClient.js";

export const connectDB = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
};