import Occurrence from "@/app/components/Admin/Occurrence";
import prisma from "@/libs/prisma/prismaClient";
import { notFound } from "next/navigation";

export default async function Occurences({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await prisma.occurrence.findUnique({
    where: {
      id: id,
    },
    include: {
      student: true,
      ImagesOnOccurrence: {
        include: { image: true },
      },
      user: {
        select: {
          name: true,
        },
      },
      OccurenceMessages: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          create_at: "desc",
        },
      },
    },
  });

  if (!data) {
    notFound();
  }

  return <Occurrence data={data} />;
}
