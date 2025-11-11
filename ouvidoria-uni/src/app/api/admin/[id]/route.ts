import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type AdminProps = {
  email?: string;
  password?: string;
  name?: string;
  role?: "admin" | "user";
  categoryId?: number;
};

export async function PUT(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json({ message: "not logged in" }, { status: 401 });
  }

  try {
    const { email, password, role, name, categoryId } =
      (await request.json()) as Partial<AdminProps>;

    const data: {
      email?: string;
      password_digested?: string;
      role?: "admin" | "user";
      name?: string;
      categoryId?: number | null;
    } = {};

    if (email) data.email = email;
    if (role) data.role = role;
    if (name) data.name = name;
    if (categoryId === 0) data.categoryId = null;
    if (categoryId !== 0) data.categoryId = Number(categoryId);

    if (password) data.password_digested = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: +id },
      data,
    });

    const path = request.nextUrl.searchParams.get("path") || "/admin/admins";
    revalidatePath(path);

    return NextResponse.json("");
  } catch (e) {
    console.error(e);
    return NextResponse.error;
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json({ message: "not logged in" }, { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: { id: +id },
    });

    const path = request.nextUrl.searchParams.get("path") || "/admin/admins";
    revalidatePath(path);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (e) {
    console.error(e);
    return NextResponse.error;
  }
}
