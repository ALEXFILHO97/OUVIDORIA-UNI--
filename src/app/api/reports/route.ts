import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma/prismaClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const reportType = searchParams.get("type");

    console.log("API Reports - Parâmetros:", { startDate, endDate, reportType });

    const whereClause: any = {};

    if (startDate && endDate) {
      whereClause.created_at = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    console.log("Where clause:", whereClause);

    switch (reportType) {
      case "quantity":
        // Buscar todas as ocorrências no período
        const occurrences = await prisma.occurrence.findMany({
          where: whereClause,
          select: {
            created_at: true,
          },
          orderBy: {
            created_at: "asc",
          },
        });

        // Agrupar por dia (ignorando hora, minuto, segundo)
        const quantityByDay = occurrences.reduce((acc, occurrence) => {
          const date = new Date(occurrence.created_at);
          // Criar chave apenas com data (YYYY-MM-DD)
          const dateKey = date.toISOString().split('T')[0];
          
          if (!acc[dateKey]) {
            acc[dateKey] = 0;
          }
          acc[dateKey]++;
          
          return acc;
        }, {} as Record<string, number>);

        // Converter para array e formatar
        const quantityData = Object.entries(quantityByDay)
          .map(([date, count]) => ({
            date: new Date(date).toISOString(),
            count: count,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        console.log("Quantity data:", quantityData);

        return NextResponse.json({
          data: quantityData,
        });

      case "byCategory":
        const categoryData = await prisma.occurrence.groupBy({
          by: ["categoryId"],
          where: whereClause,
          _count: {
            id: true,
          },
        });

        const categories = await prisma.category.findMany({
          where: {
            id: {
              in: categoryData.map((item) => item.categoryId),
            },
          },
        });

        const categoryWithNames = categoryData.map((item) => {
          const category = categories.find((cat) => cat.id === item.categoryId);
          return {
            category: category?.name || "Categoria não encontrada",
            count: item._count.id,
          };
        });

        return NextResponse.json({
          data: categoryWithNames,
        });

      case "resolutionDuration":
        const resolutionData = await prisma.occurrence.findMany({
          where: {
            ...whereClause,
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
        });

        const durationData = resolutionData.map((occurrence) => {
          const created = new Date(occurrence.created_at);
          const finished = new Date(occurrence.finished_in!);
          const durationHours = Math.round(
            (finished.getTime() - created.getTime()) / (1000 * 60 * 60)
          );

          return {
            id: occurrence.id,
            category: occurrence.category.name,
            duration: durationHours,
            created_at: occurrence.created_at,
            finished_in: occurrence.finished_in,
          };
        });

        return NextResponse.json({
          data: durationData,
        });

      default:
        return NextResponse.json(
          { error: "Tipo de relatório inválido" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro ao buscar dados dos relatórios:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
