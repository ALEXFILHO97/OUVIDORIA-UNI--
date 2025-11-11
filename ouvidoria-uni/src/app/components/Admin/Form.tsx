"use client";
import { getStatusTranslate } from "@/app/utils/functions/status-translate";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, HTMLProps, forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaLongArrowAltLeft, FaSpinner } from "react-icons/fa";

type Values = {
  message: string;
  status: string;
  userId: string;
  title: string;
};

export type FormProps = {
  status: { name: string }[];
  id: string;
  assigned: boolean;
};

export default function FormOccurrence({ status, id, assigned }: FormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = useForm<Values>({
    defaultValues: {
      status: status[0].name || "",
      message: "",
      userId: "",
      title: "",
    },
  });

  function handleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div className="inset-0 flex items-center justify-end mr-5 ">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className={[
            "p-4 rounded text-black flex gap-3 items-center mr-3 font-semibold tracking-tight transform transition-transform ease-in-out hover:translate-x-1",
          ].join(" ")}
        >
          <FaLongArrowAltLeft />
          Voltar
        </button>
        {assigned === false && (
          <button
            type="button"
            onClick={() =>
              fetch(`/api/occurrence/${id}/assigned`, { method: "PUT" })
            }
            className={[
              "p-3 rounded bg-green-500 text-white flex gap-3 items-center mr-3 font-semibold tracking-tight transform transition-transform ease-in-out hover:translate-x-1",
            ].join(" ")}
          >
            Atribuir
          </button>
        )}

        <button
          type="button"
          onClick={handleModal}
          className={[
            "p-3  bg-green-500 rounded text-white flex gap-3 items-center font-semibold tracking-tight transform transition-transform ease-in-out hover:translate-x-1",
          ].join(" ")}
        >
          Responder
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleModal}>
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
                    as="h2"
                    className="text-lg font-medium leading-6 text-gray-900 mb-5"
                  >
                    Atender Ocorrencia
                  </Dialog.Title>
                  <form
                    className="grid md:grid-cols-2 gap-3"
                    onSubmit={handleSubmit(
                      async ({ status: status, message, title }) =>
                        fetch(`/api/occurrence/${id}/messages`, {
                          method: "POST",
                          body: JSON.stringify({
                            message,
                            status,
                            title,
                          }),
                        })
                    )}
                  >
                    <Select
                      label="Status"
                      error={errors.status?.message}
                      {...register("status", { required: "obrigatório" })}
                    >
                      {status.map(({ name }) => (
                        <option value={name} key={name}>
                          {getStatusTranslate(name)}
                        </option>
                      ))}
                    </Select>
                    <Input
                      label="Título"
                      containerClass="md:col-span-2"
                      {...register("title", { required: "obrigatório" })}
                    />
                    <TextArea
                      containerClass="md:col-span-2"
                      error={errors.message?.message}
                      label="Mensagem"
                      rows={5}
                      {...register("message", { required: "obrigatório" })}
                    />

                    {isSubmitSuccessful ? (
                      <p className="text-green-500">Enviado com sucesso</p>
                    ) : (
                      <button
                        disabled={isSubmitting}
                        className={[
                          "px-7 py-3 bg-green-500 rounded text-white flex gap-3 m-auto",
                          isSubmitting ? "opacity-50" : "",
                        ].join(" ")}
                        type="submit"
                      >
                        {isSubmitting && <FaSpinner className="animate-spin" />}
                        Enviar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="block p-3"
                    >
                      Voltar
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

const Input = forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement> & {
    label?: string;
    containerClass?: string;
    error?: string;
  }
>(function Input({ className, label, containerClass, error, ...props }, ref) {
  return (
    <div className={containerClass}>
      <label>
        <div>{label}</div>
        <div>
          <input
            {...props}
            className={[
              "block border rounded px-4 py-1 w-full focus:ring focus:outline-none transition-shadow",
              error ? "border-red-500" : "border-gray-300",
              className,
            ].join(" ")}
            ref={ref}
          />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </label>
    </div>
  );
});

const Select = forwardRef<
  HTMLSelectElement,
  HTMLProps<HTMLSelectElement> & {
    label?: string;
    containerClass?: string;
    error?: string;
  }
>(function Select({ className, label, containerClass, error, ...props }, ref) {
  return (
    <div className={containerClass}>
      <label>
        <div>{label}</div>
        <div>
          <select
            {...props}
            className={[
              "block border rounded px-4 py-1 w-full focus:ring focus:outline-none transition-shadow",
              error ? "border-red-500" : "border-gray-300",
              className,
            ].join(" ")}
            ref={ref}
          />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </label>
    </div>
  );
});

const TextArea = forwardRef<
  HTMLTextAreaElement,
  HTMLProps<HTMLTextAreaElement> & {
    label?: string;
    containerClass?: string;
    error?: string;
  }
>(function TextArea(
  { className, containerClass, label, error, ...props },
  ref
) {
  return (
    <div className={containerClass}>
      <label>
        <div>{label}</div>
        <div>
          <textarea
            {...props}
            className={[
              "block border rounded px-4 py-1 w-full focus:ring focus:outline-none transition-shadow",
              error ? "border-red-500" : "border-gray-300",
              className,
            ].join(" ")}
            ref={ref}
          />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </label>
    </div>
  );
});
