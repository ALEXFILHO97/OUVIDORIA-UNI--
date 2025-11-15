import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma/prismaClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const reportType = searchParams.get("type");

    const adjustDateRange = (start: string | null, end: string | null) => {
      if (!start || !end) return null;
      
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      
      return { start: startDate, end: endDate };
    };

    switch (reportType) {
      case "quantity":
        const quantityWhereClause: any = {};
        if (startDate && endDate) {
          const dateRange = adjustDateRange(startDate, endDate);
          if (dateRange) {
            quantityWhereClause.created_at = {
              gte: dateRange.start,
              lte: dateRange.end,
            };
          }
        }
        
        const occurrences = await prisma.occurrence.findMany({
          where: quantityWhereClause,
          select: {
            created_at: true,
          },
          orderBy: {
            created_at: "asc",
          },
        });

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

        return NextResponse.json({
          data: quantityData,
        });

      case "byCategory":
        const categoryWhereClause: any = {};
        if (startDate && endDate) {
          const dateRange = adjustDateRange(startDate, endDate);
          if (dateRange) {
            categoryWhereClause.created_at = {
              gte: dateRange.start,
              lte: dateRange.end,
            };
          }
        }
        
        const categoryData = await prisma.occurrence.groupBy({
          by: ["categoryId"],
          where: categoryWhereClause,
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
        const durationWhereClause: any = {
          finished_in: {
            not: null,
          },
        };

        if (startDate && endDate) {
          const dateRange = adjustDateRange(startDate, endDate);
          if (dateRange) {
            durationWhereClause.finished_in = {
              gte: dateRange.start,
              lte: dateRange.end,
            };
          }
        }

        const resolutionData = await prisma.occurrence.findMany({
          where: durationWhereClause,
          select: {
            id: true,
            created_at: true,
            finished_in: true,
            status: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        });

        const validResolutionData = resolutionData.filter((occ) => occ.finished_in !== null);

        const durationData = validResolutionData.map((occurrence) => {
          const created = new Date(occurrence.created_at);
          const finished = occurrence.finished_in ? new Date(occurrence.finished_in) : new Date(occurrence.created_at);
          const durationMs = finished.getTime() - created.getTime();
          const durationHours = durationMs / (1000 * 60 * 60);
          const roundedHours = durationHours > 0 ? Math.max(0.01, Math.round(durationHours * 100) / 100) : 0.01;

          return {
            id: occurrence.id,
            category: occurrence.category.name,
            duration: roundedHours,
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
