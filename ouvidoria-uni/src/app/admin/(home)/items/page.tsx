import DataTable from "@/app/components/Admin/Datatable";
import Spinner from "@/app/components/Spinner";
import DeleteButton from "@/app/components/Utils/Delete-button";
import Items from "@/app/components/modals/Item";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const statuses = {
  IN_PROGRESS: (
    <span className="bg-yellow-100 text-yellow-500 px-3 py-2 rounded">
      Em progresso
    </span>
  ),
  WAITING: (
    <span className="bg-red-100 text-red-500 px-3 py-2 rounded">
      Aguardando
    </span>
  ),
  PROCEDING: (
    <span className="bg-cyan-100 text-cyan-500 px-3 py-2 rounded">
      Procedente
    </span>
  ),
  NOT_PROCEDING: (
    <span className="bg-red-100 text-red-500 px-3 py-2 rounded">
      Não procede
    </span>
  ),
  DONE: (
    <span className="bg-green-100 text-green-500 px-3 py-2 rounded">
      Finalizado
    </span>
  ),
};

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

  const categories = await prisma.category.findMany();

  const data = await prisma.item.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      category: true,
    },
  });

  if (!data) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-3xl lg:text-4xl font-semibold uppercase">Itens</h1>
        <Items categories={categories} />
      </div>
      <DataTable
        data={data}
        idExtractor={(data) => data.id.toString()}
        titles={["Nome", "Categoria", "Editar", "Deletar"]}
        rowGenerator={(row) => [
          row.name,
          row.category.name,
          <Items data={row} categories={categories} key={row.id} />,
          <DeleteButton
            id={row.id}
            key={row.id}
            url="/api/item"
            title={"Itens"}
          />,
        ]}
      />
    </>
  );
}
