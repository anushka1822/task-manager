import { PrismaClient, User } from "@prisma/client";
import { RegisterDto } from "../dtos/auth.dto";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: RegisterDto & { password: string }): Promise<User> => {
  return await prisma.user.create({
    data,
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const getAllUsers = async (): Promise<Pick<User, 'id' | 'name' | 'email'>[]> => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    }
  });
};