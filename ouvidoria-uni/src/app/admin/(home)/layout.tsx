import HeaderOuvidoria from "@/app/components/Admin/Header";
import Section from "@/app/components/Section";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ForceLightMode } from '@/app/components/ForceLightMode';

export const metadata: Metadata = {
  title: "Administração | Ouvidoria UniEvangelica",
  description: "Ouvidoria Faculdade UniEvangelica",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const user = session.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user?.email },
      })
    : null;
  if (user == null) {
    redirect("/admin/login");
  }

  return (
    <ForceLightMode>
      <HeaderOuvidoria role={user.role} />
      <Section noWidthLimit>{children}</Section>
    </ForceLightMode>
  );
}