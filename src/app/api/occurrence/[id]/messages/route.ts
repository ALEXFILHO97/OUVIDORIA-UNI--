import { authOptions } from "@/app/utils/auth";
import { sendMailFinish } from "@/app/utils/mail/functions/finish-occurrence";
import { sendMailUpdate } from "@/app/utils/mail/functions/update-occurrence";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  title: z.string(),
  message: z.string().optional(),
  status: z.enum([
    "IN_PROGRESS",
    "PROCEDING",
    "NOT_PROCEDING",
    "DONE",
    "WAITING",
  ]),
});

export async function POST(
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

  const data = messageSchema.parse(await request.json());

  if (data.message) {
    await prisma.occurenceMessages.create({
      data: {
        title: data.title,
        text: data.message,
        occurrenceId: id,
        userId: user.id,
      },
    });
  }
  if (data.status) {
    const updateData: any = {
      status: data.status,
    };

    if (data.status === "DONE") {
      const occurrence = await prisma.occurrence.findUnique({
        where: { id },
        select: { finished_in: true, status: true },
      });

      if (!occurrence?.finished_in || occurrence.status !== "DONE") {
        updateData.finished_in = new Date();
      }
    }

    await prisma.occurrence.update({
      where: { id },
      data: updateData,
    });
  }

  if (data.status === "DONE") {
    await sendMailFinish({ id: id });
  } else {
    await sendMailUpdate({ id: id });
  }

  return NextResponse.json({ message: "updated" });
}
