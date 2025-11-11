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

  if (data.extra_fields.lenght === 0) {
    data.extra_fields === null;
  }

  await prisma.category.create({
    data: {
      name: data.name,
      extra_field: data.extra_field,
      extra_fields: data.extra_fields.lenght === 0 ? null : data.extra_fields,
    },
  });

  return NextResponse.json({
    message: "success",
  });
}
