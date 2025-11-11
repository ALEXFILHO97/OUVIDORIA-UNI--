// Importa o componente DataTable para renderizar a tabela dos dados
import DataTable from "@/app/components/Admin/Datatable";
// Importa componente de carregamento
import Spinner from "@/app/components/Spinner";
// Configurações de autenticação do NextAuth
import { authOptions } from "@/app/utils/auth";
// Cliente do Prisma para consultas ao banco de dados
import prisma from "@/libs/prisma/prismaClient";
// Tipos gerados pelo Prisma
import { Category, Occurrence, User } from "@prisma/client";
// Formatação de datas (internacionalização)
import { intlFormat } from "date-fns";
// Pega a sessão do usuário autenticado
import { getServerSession } from "next-auth";
// Para criar links de navegação
import Link from "next/link";
// Para redirecionar caso usuário não esteja logado
import { redirect } from "next/navigation";

// Mapeamento de status da ocorrência com estilos visuais (tags coloridas)
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

// Tipo para incluir relacionamento (Occurrence + Category + User)
type OccurrenceAndCategory = Occurrence & {
  category: Category;
  user: User | null;
};

// Página principal do admin
export default async function home() {
  // Verifica sessão do usuário
  const session = await getServerSession(authOptions);

  // Se não estiver logado, redireciona para login
  if (!session) {
    redirect("/admin/login");
  }

  // Busca o usuário no banco através do e-mail da sessão
  const user = session.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user?.email },
      })
    : null;

  // Se não encontrar o usuário, redireciona para login
  if (user == null) {
    redirect("/admin/login");
  }

  // Array de ocorrências com categoria e usuário
  let data: OccurrenceAndCategory[];

  // Verifica o papel do usuário
  switch (user.role) {
    case "admin":
      // Se for admin, pega todas as ocorrências
      data = await prisma.occurrence.findMany({
        orderBy: {
          created_at: "desc",
        },
        include: {
          category: true,
          user: true,
        },
      });
      break;
    default:
      // Se não tiver categoria vinculada, não retorna nada
      if (user.categoryId == null) {
        return;
      }
      // Caso contrário, pega ocorrências apenas da categoria dele
      data = await prisma.occurrence.findMany({
        orderBy: {
          created_at: "desc",
        },
        where: {
          categoryId: user.categoryId,
        },
        include: {
          category: true,
          user: true,
        },
      });
      break;
  }

  // Se não houver dados, mostra spinner de carregamento
  if (!data) {
    return <Spinner />;
  }

  // Renderiza tabela com os dados
  return (
    <DataTable
      data={data} // Dados da tabela
      idExtractor={(data) => data.id} // Define id único
      titles={["Título", "Status", "Categoria", "Data", "Responsavel", "Abrir"]} // Cabeçalhos da tabela
      rowGenerator={(row) => [
        row.title, // Título
        statuses[row.status], // Status formatado
        row.category.name, // Nome da categoria
        <>
          {/* Data formatada */}
          {intlFormat(
            row.created_at,
            {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            },
            {
              locale: "pt-BR",
            }
          )}
        </>,
        <>
          {/* Mostra usuário responsável ou "Não atribuido" */}
          {row.userId === null ? (
            <span className="bg-red-100 text-red-500 px-3 py-2 rounded">
              Não atribuido
            </span>
          ) : (
            <span className="bg-green-100 text-green-500 px-3 py-2 rounded">
              {row.user?.name}
            </span>
          )}
        </>,
        // Link para abrir detalhes da ocorrência
        <Link
          key="link"
          href={`/admin/${row.id}`}
          className="bg-green-300 py-2 px-4 rounded"
        >
          Abrir
        </Link>,
      ]}
    />
  );
}
