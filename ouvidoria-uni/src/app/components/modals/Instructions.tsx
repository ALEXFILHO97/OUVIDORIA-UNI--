"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function InstructionsModal() {
  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
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
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Instruções de uso
                  </Dialog.Title>
                  <div className="mt-2">
                    <ul className="list-disc pl-5 mt-2 text-sm text-gray-500">
                      <li className="mb-2">
                        Envie sua solicitação escolhendo uma categoria e o
                        assunto desejado.
                      </li>
                      <li className="mb-2">
                        Suas informações não serão compartilhadas.
                      </li>
                      <li className="mb-2">
                        Preencha os campos obrigatórios com seu nome, e-mail e
                        telefone para contato, título da solicitação, descrição
                        e fotos, caso necessário.
                      </li>
                      <li className="mb-2">
                        Escreva detalhadamente sua solicitação, incluindo
                        informações relevantes.
                      </li>
                      <li className="mb-2">
                        Após o envio, você receberá um e-mail de confirmação com
                        os detalhes da sua solicitação.
                      </li>
                      <li className="mb-2">
                        O setor responsável analisará sua solicitação e tomará
                        as medidas necessárias.
                      </li>
                      <li className="mb-2">
                        Você também receberá atualizações por e-mail sobre o
                        andamento da sua solicitação.
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm  text-white font-medium hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Li e concordo
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
