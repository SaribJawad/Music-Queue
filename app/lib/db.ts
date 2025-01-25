import { PrismaClient } from "@prisma/client";

// this is not the best, we should introduce a singleton here
export const prismaClient = new PrismaClient();
