import prisma from "@/libs/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params: { email },
  }: {
    params: { email: string };
  }
) {
  const student = await prisma.student.findUnique({ where: { email: email } });

  if (student == null) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}
