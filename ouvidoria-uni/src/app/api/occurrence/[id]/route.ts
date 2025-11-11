import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  await getServerSession(authOptions);

  await prisma.occurrence.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({ message: "Deleted" });
}

const ratingSchema = z.object({
  rating: z.number().optional(),
});

export async function PUT(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  const { rating } = ratingSchema.parse(await request.json());

  await prisma.occurrence.update({
    where: {
      id,
    },
    data: {
      rating,
    },
  });

  return NextResponse.json({ message: "Update" });
}
