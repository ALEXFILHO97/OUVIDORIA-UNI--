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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email)) {
    const idStudent = await prisma.student.findUnique({ where: { email } });

    if (idStudent == null) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    const occurrence = await prisma.occurrence.findMany({
      where: { studentId: idStudent.id },
      include: {
        OccurenceMessages: { include: { user: { select: { name: true } } } },
        ImagesOnOccurrence: true,
        item: true,
        category: true,
        student: true,
        user: true,
      },
    });

    if (occurrence == null) {
      return NextResponse.json(
        { message: "occurrence not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(occurrence);
  } else {
    const occurrenceById = await prisma.occurrence.findMany({
      where: {
        id: email,
      },
      include: {
        category: true,
        OccurenceMessages: true,
        user: true,
      },
    });

    if (occurrenceById == null) {
      return NextResponse.json(
        { message: "occurrence not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(occurrenceById);
  }
}
