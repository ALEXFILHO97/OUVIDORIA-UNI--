import Spinner from "@/app/components/Spinner";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SimpleDashboard from "@/app/components/Admin/SimpleDashboard";

export default async function Relatorios() {
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

  // Buscar dados iniciais para o dashboard
  const [occurrences, categoryData, durationData] = await Promise.all([
    prisma.occurrence.findMany({
      select: {
        created_at: true,
      },
      orderBy: {
        created_at: "asc",
      },
    }),
    prisma.occurrence.groupBy({
      by: ["categoryId"],
      _count: {
        id: true,
      },
    }),
    prisma.occurrence.findMany({
      where: {
        finished_in: {
          not: null,
        },
      },
      select: {
        id: true,
        created_at: true,
        finished_in: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  // Agrupar ocorrências por dia
  const quantityByDay = occurrences.reduce((acc, occurrence) => {
    const date = new Date(occurrence.created_at);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    acc[dateKey]++;
    
    return acc;
  }, {} as Record<string, number>);

  const quantityData = Object.entries(quantityByDay)
    .map(([date, count]) => ({
      date: new Date(date).toISOString(),
      count: count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoryData.map((item) => item.categoryId),
      },
    },
  });

  const initialData = {
    quantity: quantityData,
    byCategory: categoryData.map((item) => {
      const category = categories.find((cat) => cat.id === item.categoryId);
      return {
        category: category?.name || "Categoria não encontrada",
        count: item._count.id,
      };
    }),
    resolutionDuration: durationData.map((occurrence) => {
      const created = new Date(occurrence.created_at);
      const finished = new Date(occurrence.finished_in!);
      const durationHours = Math.round(
        (finished.getTime() - created.getTime()) / (1000 * 60 * 60)
      );

      return {
        id: occurrence.id,
        category: occurrence.category.name,
        duration: durationHours,
        created_at: occurrence.created_at.toISOString(),
        finished_in: occurrence.finished_in!.toISOString(),
      };
    }),
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-3xl lg:text-4xl font-semibold uppercase">
          Relatorios
        </h1>
      </div>
      <SimpleDashboard initialData={initialData} />
    </>
  );
}
