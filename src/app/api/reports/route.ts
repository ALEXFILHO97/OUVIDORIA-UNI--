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
        const quantityData = await prisma.occurrence.groupBy({
          by: ["created_at"],
          where: whereClause,
          _count: {
            id: true,
          },
          orderBy: {
            created_at: "asc",
          },
        });

        console.log("Quantity data:", quantityData);

        return NextResponse.json({
          data: quantityData.map((item) => ({
            date: item.created_at,
            count: item._count.id,
          })),
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
