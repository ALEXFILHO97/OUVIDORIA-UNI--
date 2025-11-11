import Spinner from "@/app/components/Spinner";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Item() {
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

  if (user.role !== "admin") {
    redirect("/admin");
  }

  const data = await prisma.type.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!data) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-3xl lg:text-4xl font-semibold uppercase">
          Relatorios
        </h1>
      </div>
    </>
  );
}
