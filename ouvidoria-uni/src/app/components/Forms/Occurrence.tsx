"use client";
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* @ts-ignore */
import {
  FileField,
  TextAreaField,
  TextField,
} from "@/app/components/Utils/OccurrenceFields";
import { RadioGroup, Switch } from "@headlessui/react";
import { Category, Item, Student, Type } from "@prisma/client";
import { Key, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import Spinner from "../Spinner";

export type FormProps = {
  defaultValues: Values;
  categories?: Category[];
  items?: Item[];
  types?: Type[];
};

type Values = {
  title: string;
  description: string;
  pictures: string[];
  itemId?: number;
  isAnonymous?: boolean;
  typeId?: number;
  student?: { name: string; email: string; phone: string } | null;
  extra_fields?: any;
};

export default function FormOccurrence({
  defaultValues,
  categories,
  items,
  types,
}: FormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    resetField,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      isAnonymous: false,
      ...defaultValues,
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>();
  const [selectedType, setSelectedType] = useState();
  const [errorStatus, setErrorStatus] = useState<number>();
  const isAnonymous = watch("isAnonymous");
  const [selectedItem, setSelectedItem] = useState();
  const [idOccurrence, setIdOccurrence] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<Student>({
    email: "",
    name: "",
    phone: "",
    id: "",
    created_at: new Date(),
    updated_at: new Date(),
  });

  console.log(selectedItem);

  const phoneRegex = /^(\(\d{2}\)\s?)?\d{5}-\d{4}$/;

  if (!categories || !items || !types) {
    return <Spinner />;
  }

  async function onSubmit(values: Values) {
    await toast.promise(handleSubmitOccurrence(values), {
      loading: "Saving...",
      success: (
        <div className="font-bold">
          Enviado com sucesso! <br /> Em breve entraremos em contato.
        </div>
      ),
      error: (
        <div className="font-bold">
          Erro ao enviar. <br />
          {errorStatus === 500
            ? "Telefone já cadastrado"
            : "Recarregue e tente novamente"}
        </div>
      ),
    });
  }

  async function handleSubmitOccurrence(values: Values) {
    try {
      if (isAnonymous) {
        values.student = null;
      }

      console.log(values);

      const data = {
        categoryId: selectedCategory!.id,
        itemId: selectedItem,
        typeId: selectedType,
        ...values,
      };

      const resp = await fetch(`/api/occurrence`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        setErrorStatus(resp.status);
        throw new Error(String(resp.status));
      }

      const { id } = await resp.json();

      setIdOccurrence(id);
    } catch (error: any) {
      setErrorStatus(Number(error.message));
      throw new Error(error.message);
    }
  }

  return (
    <div className="h-full w-full flex  flex-col">
      <Toaster />
      {idOccurrence === null ? (
        <>
          <span className="mb-4 font-semibold">Selecione o tipo</span>
          <RadioGroup
            value={selectedType}
            onChange={setSelectedType}
            className="mb-4"
          >
            <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
            <div className="space-y-2 ">
              {types.map((type) => (
                <RadioGroup.Option
                  key={type.name}
                  value={type.id}
                  className={({ active, checked }) =>
                    `${
                      active
                        ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300"
                        : ""
                    }
                  ${
                    checked
                      ? "bg-green-400 bg-opacity-75 text-white"
                      : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                  }
                >
                  {({ checked }) => (
                    <>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label
                              as="p"
                              className={`font-medium  ${
                                checked ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {type.name}
                            </RadioGroup.Label>
                          </div>
                        </div>
                        {checked && (
                          <div className="shrink-0 text-white">
                            <CheckIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          {selectedType && (
            <>
              <span className="mb-4 font-semibold">
                Selecione uma categoria
              </span>
              <RadioGroup
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="mb-4"
              >
                <RadioGroup.Label className="sr-only">
                  Server size
                </RadioGroup.Label>
                <div className="space-y-2 ">
                  {categories.map((category) => (
                    <RadioGroup.Option
                      key={category.name}
                      value={category}
                      className={({ active, checked }) =>
                        `${
                          active
                            ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300"
                            : ""
                        }
                  ${
                    checked
                      ? "bg-green-400 bg-opacity-75 text-white"
                      : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                      }
                    >
                      {({ checked }) => (
                        <>
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium  ${
                                    checked ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {category.name}
                                </RadioGroup.Label>
                              </div>
                            </div>
                            {checked && (
                              <div className="shrink-0 text-white">
                                <CheckIcon className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </>
          )}

          {selectedCategory && (
            <>
              <span className="mb-4 font-semibold">Selecione o assunto</span>
              <RadioGroup
                value={selectedItem}
                onChange={setSelectedItem}
                className="mb-4"
              >
                <RadioGroup.Label className="sr-only"></RadioGroup.Label>
                <div className="space-y-2 ">
                  {items
                    .filter((item) => item.categoryId === selectedCategory.id)
                    .map((item) => (
                      <RadioGroup.Option
                        key={item.id}
                        value={item.id}
                        className={({ active, checked }) =>
                          `${
                            active
                              ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300"
                              : ""
                          }
                ${
                  checked ? "bg-green-400 bg-opacity-75 text-white" : "bg-white"
                }
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium  ${
                                      checked ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {item.name}
                                  </RadioGroup.Label>
                                </div>
                              </div>
                              {checked && (
                                <div className="shrink-0 text-white">
                                  <CheckIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                </div>
              </RadioGroup>
            </>
          )}
          {selectedItem && (
            <>
              <span className="mb-4 font-semibold">Descreva abaixo</span>
              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  name="isAnonymous"
                  render={({ field: { onChange, value } }) => (
                    <label className="flex gap-2 items-center">
                      <Switch
                        checked={value}
                        onChange={(v) => {
                          if (v) {
                            resetField("student.email");
                            resetField("student.name");
                            resetField("student.phone");
                          }
                          onChange(v);
                        }}
                        className={`${value ? "bg-green-500" : "bg-gray-500"}
          relative flex items-center h-6 w-10 shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            value ? "translate-x-4" : "translate-x-0"
                          }
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      <span>Enviar como anônimo</span>
                    </label>
                  )}
                />

                {isAnonymous === false && (
                  <>
                    <TextField
                      {...register("student.email", {
                        validate: (v) => {
                          if (isAnonymous) return true;

                          return v.length > 0 ? true : "obrigatório";
                        },
                      })}
                      onChange={async (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        try {
                          const resp = await fetch(
                            `/api/students/${e.target.value}`
                          );

                          if (resp.ok) {
                            setStudentData(await resp.json());
                            return;
                          }

                          if (!resp.ok) {
                            if (resp.status === 404) {
                              return;
                            } else {
                              throw new Error("Dead");
                            }
                          }
                        } catch (error) {
                          console.log(error);
                        } finally {
                        }
                      }}
                      className="flex h-10 mt-4 w-full rounded-md border border-input bg-white px-1 py-1 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                      label={"E-mail"}
                      disabled={isAnonymous}
                      placeholder="Insira seu e-mail"
                    />
                    <TextField
                      label="Nome completo"
                      className="w-full"
                      disabled={isAnonymous}
                      defaultValue={studentData.name}
                      placeholder="Insira seu nome completo"
                      {...register("student.name", {
                        validate: (v) => {
                          if (isAnonymous) return true;

                          return v.length > 0 ? true : "obrigatório";

                        },
                      })}
                    />
                    {errors.student?.email && (
                      <p className="text-red-500">
                        {errors.student?.email?.message}
                      </p>
                    )}
                    <TextField
                      label="Telefone"
                      className="w-full"
                      defaultValue={studentData?.phone || ""}
                      placeholder="Insira seu telefone para contato"
                      {...register("student.phone", {
                        validate: (v) => {
                          if (isAnonymous) return true;

                          return v.length > 0 ? true : "obrigatório";
                        },
                        pattern: {
                          value: phoneRegex,
                          message: "Telefone inválido",
                        },
                      })}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        const formattedValue = formatPhoneNumber(value);
                        setValue("student.phone", formattedValue);
                      }}
                      disabled={isAnonymous}
                    />
                    {errors.student?.phone && (
                      <p className="text-red-500">
                        {errors.student?.phone.message}
                      </p>
                    )}
                  </>
                )}
                {selectedCategory?.extra_field === true && (
                  <div>
                    {
                      // @ts-ignore
                      selectedCategory?.extra_fields?.map(
                        (extraField: { name: string }, index: Key) => (
                          <TextField
                            key={index}
                            label={extraField.name}
                            className="w-full"
                            {...register(`extra_fields.${extraField.name}`, {
                              required: true,
                            })}
                          />
                        )
                      )
                    }
                  </div>
                )}
                <TextField
                  label="Título"
                  className="w-full"
                  placeholder="Insira um título"
                  {...register("title", { required: true })}
                />
                <div className="col-span-2">
                  <TextAreaField
                    label="Detalhes"
                    placeholder="Insira os detalhes necessários"
                    {...register("description", { required: true })}
                  />
                </div>
                <div className="col-span-2">
                  <Controller
                    control={control}
                    name="pictures"
                    render={({
                      field: { name, onBlur, onChange, ref, value },
                    }) => (
                      <>
                        <FileField
                          name={name}
                          onBlur={onBlur}
                          onImageUploaded={(filePath: string) =>
                            onChange([...value, filePath])
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-white px-1 py-1 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                          ref={ref}
                          label={"Imagens"}
                          accept="image/png, image/gif, image/jpeg"
                        />

                        {value.map((image) => (
                          <div className="flex items-center gap-3" key={image}>
                            <img src={image} key={image} className="w-24" />
                            <button
                              className="text-red-500"
                              onClick={() =>
                                onChange(value.filter((f) => f !== image))
                              }
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center  mt-3">
                  <button
                    type="submit"
                    className={[
                      "bg-green-500 rounded text-white px-4 py-2 flex items-center",
                      isSubmitting ? "opacity-50" : "",
                    ].join(" ")}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <FaSpinner className="animate-spin" />}{" "}
                    Enviar
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="font- mb-2">
            Recebemos sua solicitação. Todos os acompanhamentos serão
            encaminhados para o e-mail fornecido. Você também pode acompanhar o
            progresso ao inserir o e-mail ou ID no campo de busca. Caso tenha
            optado pelo envio anônimo, por favor, utilize o ID no campo de busca
            correspondente.
          </div>
          <br />
          <div className="font-normal text-gray-500">
            Solicitação de ID {idOccurrence}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatPhoneNumber(phoneNumber: string) {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}
