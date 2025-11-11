import prisma from "@/libs/prisma/prismaClient";
import { UserLoginData } from "@/types/user-login-data";
import { compare } from "bcrypt";

export async function loginUser({ email, password }: UserLoginData) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password_digested == null) {
    throw new Error("Invalid email");
  }

  const isValid = await compare(password, user.password_digested);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  return user;
}
