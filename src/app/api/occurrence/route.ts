import { sendMailResponsible } from "@/app/utils/mail/functions/new-occorrence-responsible";
import { sendMailNew } from "@/app/utils/mail/functions/new-occurrence";
import prisma from "@/libs/prisma/prismaClient";
import { NextResponse } from "next/server";
import { z } from "zod";

const occurrenceSchema = z.object({
  title: z.string(),
  description: z.string(),
  categoryId: z.number(),
  itemId: z.number(),
  typeId: z.number(),
  pictures: z.string().array().nullable(),
  student: z
    .object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
    })
    .nullable(),
});

export async function POST(request: Request) {
  try {
    let body = await request.json();

    console.log(body.extra_fields);

    const data = occurrenceSchema.parse(body);
    if (data.student) {
      const student = await prisma.student.upsert({
        where: {
          email: data.student.email,
        },
        create: {
          name: data.student.name,
          email: data.student.email,
          phone: data.student.phone,
        },
        update: {
          name: data.student.name,
          phone: data.student.phone,
        },
      });

      const created = await prisma.occurrence.create({
        data: {
          categoryId: data.categoryId,
          title: data.title,
          description: data.description,
          studentId: student.id,
          extra_fields: body.extra_fields,
          itemId: data.itemId,
          typeId: data.typeId,
          ImagesOnOccurrence: {
            create: (body.pictures || []).map((url: string) => ({
              image: { connect: { url } },
            })),
          },
        },
      });

      await sendMailNew({ email: data.student.email, id: created.id });
      await sendMailResponsible({ id: created.id });

      return NextResponse.json({ id: created.id }, { status: 201 });
    }

    const created = await prisma.occurrence.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        typeId: data.typeId,
        extra_fields: body.extra_fields,
        itemId: data.itemId,
        ImagesOnOccurrence: {
          create: (body.pictures || []).map((url: string) => ({
            image: { connect: { url } },
          })),
        },
      },
    });

    await sendMailResponsible({ id: created.id });
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar ocorrência:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
