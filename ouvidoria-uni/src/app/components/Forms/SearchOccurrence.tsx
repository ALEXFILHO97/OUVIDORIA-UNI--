"use client";
import Details from "@/app/components/modals/Details";
import {
  Category,
  Item,
  OccurenceMessages,
  User,
  type Occurrence,
} from "@prisma/client";
import { intlFormat } from "date-fns";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";

const statuses = {
  IN_PROGRESS: (
    <span className="bg-yellow-100 text-yellow-500 px-1 rounded">
      Em Atendimento
    </span>
  ),
  WAITING: (
    <span className="bg-yellow-100 text-yellow-500 px-1 rounded">
      Aguardando
    </span>
  ),
  PROCEDING: (
    <span className="bg-cyan-100 text-cyan-500 px-1 rounded">Procedente</span>
  ),
  NOT_PROCEDING: (
    <span className="bg-red-100 text-red-500 px-1 rounded">Não procede</span>
  ),
  DONE: (
    <span className="bg-green-100 text-green-500 px-1 rounded">Finalizado</span>
  ),
};

export type OccurrenceProps = {};

type OccurrenceAndMessages = Occurrence & {
  OccurenceMessages: (OccurenceMessages & {
    user: {
      name: string;
    } | null;
  })[];
  item: Item;
  category: Category;
  user: User | null;
};

export default function SearchOccurrence({}: OccurrenceProps) {
  const [error, setError] = useState<string | null>(null);
  const [occurrences, setOccurrences] = useState<OccurrenceAndMessages[]>([]);
  const [emailStudent, setEmailStudent] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);

    try {
      const resp = await fetch(`/api/occurrence/search/${emailStudent}`);

      const body = await resp.json();

      if (!resp.ok || body.length === 0) {
        if (resp.status === 404 || body.length === 0) {
          setError(
            "Não foi possível encontrar sua ocorrência, verifique o e-mail ou protocolo e tente novamente"
          );
        } else {
          setError(
            "Ocorreu um erro inesperado, por favor, tente novamente mais tarde"
          );
        }
      }

      setOccurrences(body);
    } catch (e) {
      setError(
        "Ocorreu um erro inesperado, por favor, tente novamente mais tarde"
      );
    } finally {
      setLoading(false);
    }
  };

  if (error != null) {
    return (
      <>
        <p className="text-center">{error}</p>
        <button
          onClick={() => {
            setOccurrences([]);
            setError(null);
            setLoading(false);
          }}
          className="text-black p-3 flex gap-2 items-center rounded mt-3"
        >
          <FaArrowLeft /> Voltar
        </button>
      </>
    );
  }

  if (occurrences.length === 0) {
    return (
      <div className="border rounded relative w-full">
        <input
          name="id"
          type="text"
          className="p-3 w-full rounded pr-5 transition-shadow focus:outline-none focus:ring"
          autoComplete="off"
          placeholder="Informe seu e-mail ou protocolo da solicitação"
          value={emailStudent}
          onChange={(e) => setEmailStudent(e.target.value)}
        />
        <button
          type="submit"
          className={[
            "p-3 absolute right-0 top-0 bottom-0 bg-green-400 text-white rounded-r",
            isLoading ? "opacity-50" : "",
          ].join(" ")}
          onClick={connect}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaArrowRight />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-full overflow-x-auto flex-col max-w-full">
      <table className="shadow-md rounded-xl w-full l">
        <thead className="rounded-lg">
          <tr>
            <th className="px-4 py-2 rounded-l-lg">Assunto</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2 rounded-r-lg">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {occurrences.map((occurrence) => (
            <tr
              key={occurrence.id}
              className="hover:bg-gray-100 transition-colors"
            >
              <td className="px-4 py-2">{occurrence.title}</td>
              <td className="px-4 py-2">{statuses[occurrence.status]}</td>
              <td className="px-4 py-2">
                {intlFormat(
                  new Date(occurrence.created_at),
                  {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  },
                  { locale: "pt-BR" }
                )}
              </td>
              <td className="px-4 py-2 ">
                <Details data={occurrence} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          setOccurrences([]);
          setError(null);
          setLoading(false);
        }}
        className="text-black p-3 flex gap-2 items-center rounded mt-3"
      >
        <FaArrowLeft /> Voltar
      </button>
    </div>
  );
}
