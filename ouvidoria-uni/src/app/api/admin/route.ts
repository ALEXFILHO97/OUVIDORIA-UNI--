import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session == null) {
      return NextResponse.json({ message: "not logged in" }, { status: 401 });
    }

    const { email, password, role, categoryId, departmentId, name } =
      await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    let category;

    if (categoryId === 0) {
      category = null;
    } else {
      category = categoryId;
    }

    const created = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        password_digested: hashedPassword,
        role,
        categoryId: Number(category),
        name,
      },
      create: {
        email,
        password_digested: hashedPassword,
        role,
        categoryId: Number(category),
        name,
      },
    });

    return NextResponse.json({ email: created.email, id: created.id });
  } catch (error) {
    console.log(error);
    return NextResponse.error;
  }
}
