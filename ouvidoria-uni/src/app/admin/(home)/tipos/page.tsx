import DataTable from "@/app/components/Admin/Datatable";
import Spinner from "@/app/components/Spinner";
import DeleteButton from "@/app/components/Utils/Delete-button";
import Type from "@/app/components/modals/Type";
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
          Tipos de solicitação
        </h1>
        <Type />
      </div>
      <DataTable
        data={data}
        idExtractor={(data) => data.id.toString()}
        titles={["#", "Nome", "Editar", "Deletar"]}
        rowGenerator={(row) => [
          row.id,
          row.name,
          <Type data={row} key={row.id} />,
          <DeleteButton
            id={row.id}
            key={row.id}
            url="/api/type"
            title={"Tipo"}
          />,
        ]}
      />
    </>
  );
}
