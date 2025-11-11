"use client";
import { Dialog, Transition } from "@headlessui/react";
import {
  Category,
  Item,
  OccurenceMessages,
  Occurrence,
  User,
} from "@prisma/client";
import { intlFormat } from "date-fns";
import { Fragment, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const statuses = {
  IN_PROGRESS: (
    <span className="bg-yellow-100 text-yellow-500 px-1 rounded">
      Em atendimento
    </span>
  ),
  WAITING: (
    <span className="bg-yellow-100 text-yellow-500 px-1 rounded">
      Em atendimento
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

export default function Details({ data }: { data: OccurrenceAndMessages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(data.rating);

  console.log(data);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleRating(value: number) {
    setRating(value);
  }

  async function submitRating() {
    console.log(rating);

    await toast.promise(sendRating(), {
      loading: "Enviando...",
      success: <div className="font-bold">Enviado com sucesso.</div>,
      error: <div className="font-bold">Erro ao enviar.</div>,
    });
  }

  async function sendRating() {
    try {
      const ratingData = {
        rating: rating,
      };

      const resp = await fetch(`/api/occurrence/${data.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(ratingData),
      });
      if (!resp.ok) {
        throw new Error();
      }

      console.log(resp);
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }
  console.log(data);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-md bg-green-500 bg-opacity-90 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Detalhes
      </button>
      <Toaster />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-[24px] font-medium leading-6 text-gray-900 mb-4"
                  >
                    {data.title}
                  </Dialog.Title>
                  <div className="relative">
                    <span className="float-right">{statuses[data.status]}</span>
                    <p>
                      <b>Data: </b>{" "}
                      {intlFormat(
                        new Date(data.created_at),
                        {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        },
                        { locale: "pt-BR" }
                      )}
                    </p>
                    {data.assigned_in && (
                      <p>
                        <b>Iniciado: </b>{" "}
                        {intlFormat(
                          new Date(data.assigned_in),
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          },
                          { locale: "pt-BR" }
                        )}
                      </p>
                    )}
                    {data.finished_in && (
                      <p>
                        <b>Finalizado: </b>{" "}
                        {intlFormat(
                          new Date(data.finished_in),
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          },
                          { locale: "pt-BR" }
                        )}
                      </p>
                    )}
                    <p>
                      <b>Responsável: </b>
                      {data.user === null ? "Não atribuido" : data.user.name}
                    </p>
                    <div>
                      <ul>
                        {data.extra_fields !== null &&
                          // @ts-ignore
                          Object.keys(data.extra_fields).map((key) => (
                            <li key={key}>
                              <b>{key}: </b>
                              {
                                //@ts-ignore
                                data.extra_fields[key]
                              }
                            </li>
                          ))}
                      </ul>
                    </div>
                    <p className="my-2 ">
                      <b>Descrição: </b> {data.description}
                    </p>

                    <span className="my-2">Acompanhamentos: </span>

                    {data.OccurenceMessages.length === 0
                      ? "Nenhuma mensagem disponível"
                      : data.OccurenceMessages.map((message) => (
                          <div key={message.id} className="mb-3 border-b p-3">
                            <h5 className="font-normal">
                              <b>Atendente: </b>
                              {message.user?.name}
                            </h5>
                            <p className="">
                              <b>Assunto: </b>
                              {message.title}
                            </p>
                            <p>
                              <b>Detalhes: </b>
                              {message.text}
                            </p>
                          </div>
                        ))}
                  </div>
                  {data.status === "DONE" && (
                    <div className="w-full mt-4 flex flex-col">
                      <span className="my-2 font-semibold">
                        {data.rating === null
                          ? " Avalie nosso atendimento"
                          : "Sua avaliação foi:"}
                      </span>
                      <div className="inline-block m-auto">
                        {[5, 4, 3, 2, 1].map((value) => (
                          <Fragment key={value}>
                            <input
                              value={value}
                              name="rating"
                              id={`star${value}`}
                              type="radio"
                              className="hidden"
                              onClick={() => handleRating(value)}
                            />
                            <label
                              htmlFor={`star${value}`}
                              className={`rating-label float-right cursor-pointer transition-colors duration-300 ${
                                value <= (rating || 0)
                                  ? "text-blue-500"
                                  : "text-gray-300"
                              } hover:text-blue-500`}
                              style={{ fontSize: "32px" }}
                            >
                              ★
                            </label>
                          </Fragment>
                        ))}
                      </div>
                      <button
                        type="button"
                        className={`inline-flex justify-center rounded-md border border-transparent ${
                          data.rating === null
                            ? "bg-green-400"
                            : "bg-green-200 opacity-75"
                        } px-4 py-2 text-sm font-medium text-black hover:bg-green-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2`}
                        onClick={() => submitRating()}
                        disabled={data.rating !== null}
                      >
                        {data.rating === null ? "Avaliar" : "Já avaliado"}
                      </button>
                    </div>
                  )}
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Voltar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
