import DataTable from "@/app/components/Admin/Datatable";
import Spinner from "@/app/components/Spinner";
import DeleteButton from "@/app/components/Utils/Delete-button";
import FormUser from "@/app/components/modals/User";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Users() {
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

  if (user?.role !== "admin") {
    redirect("/admin");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!categories) {
    return <Spinner />;
  }

  const data = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      category: true,
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-3xl lg:text-4xl font-semibold uppercase">
          Usuários
        </h1>
        <FormUser categories={categories} />
      </div>
      <DataTable
        data={data}
        titles={["#", "Nome", "Email", "Tipo", "Categoria", "Editar", "Apagar"]}
        idExtractor={(row) => row.id.toString()}
        rowGenerator={(row) => [
          row.id,
          row.name,
          row.email,
          <span
            key="role"
            className={[
              "px-2 py-2 rounded text-xm text-white",
              row.role === "admin" ? "bg-red-500" : "bg-blue-500",
            ].join(" ")}
          >
            {row.role}
          </span>,
          <span
            key="role"
            className={[
              "px-2 py-2 rounded text-xm text-white",
              row.categoryId === null ? "bg-red-500" : "bg-blue-500",
            ].join(" ")}
          >
            {row.categoryId === null ? "Todas" : row.category?.name}
          </span>,
          <FormUser data={row} categories={categories} key={row.id} />,
          <DeleteButton
            id={row.id}
            key={row.id}
            url="/api/admin"
            title={"Admin"}
          />,
        ]}
      />
    </>
  );
}
