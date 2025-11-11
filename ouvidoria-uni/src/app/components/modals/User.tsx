"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Category, User } from "@prisma/client";
import { Fragment, HTMLProps, forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPen, FaSpinner } from "react-icons/fa";

type Values = {
  name: string;
  password: string;
  email: string;
  role: string;
  categoryId: number;
};

export default function FormUser({
  data,
  categories,
}: {
  data?: User;
  categories: Category[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = useForm<Values>({
    defaultValues: {
      name: `${data === undefined ? "" : data.name}`,
      password: ``,
      email: `${data === undefined ? "" : data.email}`,
      categoryId: data?.categoryId || 0,
      role: data?.role || "user",
    },
  });

  function handleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleModal}
        className="bg-green-500 text-white block rounded px-4 py-2"
      >
        {data ? <FaPen /> : "Novo"}
      </button>

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
                    {data ? "Editar" : "Criar novo usuário"}
                  </Dialog.Title>
                  <form
                    className="grid-cols-2 md:grid-cols-2 gap-3"
                    onSubmit={handleSubmit(
                      async ({ role, email, name, password, categoryId }) => {
                        if (data) {
                          const body = {
                            email: email,
                            name: name,
                            role: role,
                            password: password,
                            categoryId: categoryId,
                          };

                          fetch(`/api/admin/${data.id}`, {
                            method: "PUT",
                            body: JSON.stringify(body),
                          });
                          return;
                        }

                        fetch(`/api/admin`, {
                          method: "POST",
                          body: JSON.stringify({
                            role,
                            email,
                            name,
                            password,
                            categoryId,
                          }),
                        });
                      }
                    )}
                  >
                    <Select
                      label="Tipo"
                      error={errors.role?.message}
                      {...register("role", { required: "obrigatório" })}
                    >
                      <option value={"admin"}>Administrador</option>
                      <option value={"user"}>Atendente</option>
                    </Select>
                    <Select
                      label="Categoria"
                      error={errors.categoryId?.message}
                      {...register("categoryId", { required: "obrigatório" })}
                    >
                      <option value={0}>Todas</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    <Input
                      label="Nome"
                      type="text"
                      error={errors.name?.message}
                      placeholder={data?.name || ""}
                      {...register("name", { required: "obrigatório" })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      defaultValue={data?.email}
                      placeholder={data?.email}
                      error={errors.email?.message}
                      {...register("email", { required: "obrigatório" })}
                    />
                    <Input
                      label="Senha"
                      type="password"
                      error={errors.password?.message}
                      {...register("password", {})}
                    />
                    <div className="flex justify-center">
                      {isSubmitSuccessful ? (
                        <p className="text-green-500">Enviado com sucesso</p>
                      ) : (
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
                          Enviar
                        </button>
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
>(function Input(
  {
    className,
    label,
    containerClass,
    error,
    placeholder,
    defaultValue,
    ...props
  },
  ref
) {
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
            placeholder={placeholder}
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
function setValueAs(arg0: string, name: string | null): any {
  throw new Error("Function not implemented.");
}
