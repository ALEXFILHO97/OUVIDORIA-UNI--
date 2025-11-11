import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json({ message: "not logged in" }, { status: 401 });
  }

  try {
    await prisma.item.delete({
      where: { id: +id },
    });

    const path = request.nextUrl.searchParams.get("path") || "/admin/items";
    revalidatePath(path);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (e) {
    console.error(e);
    return NextResponse.error;
  }
}

export async function PUT(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json({ message: "not logged in" }, { status: 401 });
  }

  const { data } = await request.json();

  try {
    await prisma.item.update({
      where: { id: +id },
      data: {
        ...data,
      },
    });

    const path = request.nextUrl.searchParams.get("path") || "/admin/items";
    revalidatePath(path);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (e) {
    console.error(e);
    return NextResponse.error;
  }
}
