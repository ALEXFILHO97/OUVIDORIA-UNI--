"use client";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { Category } from "@prisma/client";
import { Fragment, HTMLProps, forwardRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaPen, FaSpinner } from "react-icons/fa";

type Values = {
  name: string;
  extra_fields: Array<{ name: string }>;
  extra_field: boolean;
};

export default function Category({ data }: { data?: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [extra, setExtra] = useState(false);
  const {
    register,
    control,
    resetField,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = useForm<Values>({
    defaultValues: {
      name: data?.name || "",
    },
  });

  function handleModal() {
    setIsOpen(!isOpen);
  }

  const { fields, append, remove } = useFieldArray({
    name: "extra_fields",
    control,
  });

  return (
    <>
      <div
        className={!data ? `inset-0 flex items-center justify-end mr-5 ` : ""}
      >
        <button
          type="button"
          onClick={handleModal}
          className={
            !data
              ? `
            hover:bg-green-600 px-3 py-2 bg-green-500 rounded text-white flex gap-3 items-center font-medium
          `
              : "hover:bg-green-600 rounded-lg p-3 bg-green-500 text-white flex gap-3 items-center font-medium"
          }
        >
          {data ? <FaPen /> : "Nova categoria"}
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
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-5"
                  >
                    {data ? "Editar" : "Criar nova"}
                  </Dialog.Title>
                  <form
                    className="grid-cols-2 md:grid-cols-2 gap-3"
                    onSubmit={handleSubmit(
                      async ({ name, extra_fields, extra_field }) => {
                        if (!data) {
                          fetch(`/api/category`, {
                            method: "POST",
                            body: JSON.stringify({
                              data: {
                                name,
                                extra_fields,
                                extra_field: extra,
                              },
                            }),
                          });
                        } else {
                          fetch(`/api/category/${data.id}`, {
                            method: "PUT",
                            body: JSON.stringify(name),
                          });
                        }
                      }
                    )}
                  >
                    <Input
                      label="Nome"
                      type="text"
                      error={errors.name?.message}
                      {...register("name", { required: true })}
                    />

                    <Controller
                      control={control}
                      name="extra_field"
                      render={({ field: { onChange, value } }) => (
                        <label className="flex gap-2 items-center my-2">
                          <Switch
                            checked={extra}
                            onChange={(v) => {
                              setExtra(v);
                            }}
                            className={`${
                              extra ? "bg-green-500" : "bg-gray-500"
                            }
          relative flex items-center h-6 w-10 shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                          >
                            <span
                              aria-hidden="true"
                              className={`${
                                extra ? "translate-x-4" : "translate-x-0"
                              }
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                            />
                          </Switch>
                          <span>Campo Extra</span>
                        </label>
                      )}
                    />

                    {fields.map((field, index) => {
                      return (
                        <div key={index}>
                          <Input
                            label="Nome do Campo"
                            type="text"
                            error={errors.name?.message}
                            {...register(`extra_fields.${index}.name`, {
                              required: true,
                            })}
                          />

                          <button
                            type="button"
                            className="text-red-400"
                            onClick={() => remove(index)}
                          >
                            Remover
                          </button>
                        </div>
                      );
                    })}

                    {extra === true && (
                      <button
                        className={
                          "px-7 py-3 bg-green-500 rounded text-white flex gap-3 items-center mt-3"
                        }
                        onClick={() =>
                          append({
                            name: "",
                          })
                        }
                      >
                        Adicionar campo
                      </button>
                    )}

                    <div className="flex justify-between">
                      {isSubmitSuccessful ? (
                        <p className="text-green-500">Criado com sucesso</p>
                      ) : (
                        <>
                          <button
                            className={[
                              "px-7 py-3 bg-green-500 rounded text-white flex gap-3 items-center mt-3",
                              isSubmitting ? "opacity-50" : "",
                            ].join(" ")}
                            type="submit"
                          >
                            {isSubmitting && (
                              <FaSpinner className="animate-spin" />
                            )}
                            Salvar
                          </button>
                        </>
                      )}
                    </div>
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

