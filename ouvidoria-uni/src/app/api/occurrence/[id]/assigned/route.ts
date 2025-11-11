import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json(
      {
        message: "Missing token",
      },
      { status: 401 }
    );
  }

  const user = session.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user?.email },
      })
    : null;
  if (user == null) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      { status: 401 }
    );
  }

  await prisma.occurrence.update({
    where: {
      id,
    },
    data: {
      assigned_in: new Date(),
      userId: user.id,
    },
  });

  return NextResponse.json({ message: "Update" });
}
