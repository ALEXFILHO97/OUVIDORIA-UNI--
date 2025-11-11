import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { data } = await request.json();
  const session = await getServerSession(authOptions);
  if (session == null) {
    return NextResponse.json({ message: "not logged in" }, { status: 401 });
  }

  await prisma.item.create({
    data: {
      name: data.name,
      categoryId: Number(data.categoryId),
    },
  });

  return NextResponse.json({
    message: "success",
  });
}
