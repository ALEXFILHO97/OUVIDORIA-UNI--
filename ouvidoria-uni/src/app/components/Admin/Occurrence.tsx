import Section from "@/app/components/Section";
import { status } from "@/app/utils/functions/status";
import { getStatusClass } from "@/app/utils/functions/status-class";
import { getStatusTranslate } from "@/app/utils/functions/status-translate";
import {
  Category,
  Image,
  Item,
  OccurenceMessages,
  Occurrence,
  Student,
  User,
} from "@prisma/client";
import { intlFormat } from "date-fns";
import { Fragment } from "react";
import Spinner from "../Spinner";
import FormOccurrence from "./Form";
import ImageSelector from "./ImageSelector";

type OccurrenceAndMessages = Occurrence & {
  OccurenceMessages: (OccurenceMessages & {
    user: {
      name: string;
    } | null;
  })[];
  item: Item;
  category: Category;
  user: User | null;
  student: Student | null;
  ImagesOnOccurrence: {
    image: Image[];
  }[];
};

export default function Occurrence({
  data,
}: {
  data: OccurrenceAndMessages | any;
}) {
  if (!status || !data) {
    return <Spinner />;
  }
  return (
    <Section noWidthLimit>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-4">
        <div className="px-4 py-5 sm:px-6">
          <FormOccurrence
            status={status}
            id={data.id}
            assigned={data.assigned_in != null}
          />
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-3">
            {data.title}
          </h3>
          <div className={`${getStatusClass(data.status)} mb-3`}>
            {getStatusTranslate(data.status)}
          </div>

          {data.student ? (
            <>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {data.student.name}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {data.student?.email}
              </p>
            </>
          ) : (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Anônimo</p>
          )}
          <p className="mt-1 max-w-2xl text-sm text-gray-500"></p>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {data.student?.email}
          </p>
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            Atribuido:
            {data.assigned_in !== null && (
              <>
                {intlFormat(
                  data.assigned_in,
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
                )}{" "}
                - {data.user?.name}
              </>
            )}
          </span>
        </div>

        <div className="border-t mb-4">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              {data.extra_fields !== null &&
                // @ts-ignore
                Object.keys(data.extra_fields).map((key) => (
                  <>
                    <dt className="text-sm font-medium text-gray-500" key={key}>
                      {key}:{" "}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {
                        //@ts-ignore
                        data.extra_fields[key]
                      }
                    </dd>
                  </>
                ))}
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Descrição</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {data.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {data.ImagesOnOccurrence.length > 0 && (
        <div className="md:max-w-[60vw] lg:max-w-[40vw] md:m-auto">
          <ImageSelector
            images={data.ImagesOnOccurrence.map(
              ({ image }: { image: any }) => image
            )}
          />
        </div>
      )}

      {data.rating && (
        <Section noWidthLimit>
          <div className="inline-block m-auto ">
            {[5, 4, 3, 2, 1].map((value) => (
              <Fragment key={value}>
                <input
                  value={value}
                  name="rating"
                  id={`star${value}`}
                  type="radio"
                  className="hidden"
                />
                <label
                  htmlFor={`star${value}`}
                  className={`rating-label float-right cursor-pointer transition-colors duration-300 ${
                    value <= (data.rating || 0)
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
          <br />
          <span className="m-auto text-gray-400">
            Avaliado com {data.rating}
          </span>
        </Section>
      )}

      {data.OccurenceMessages.length > 0
        ? data.OccurenceMessages.map((message: any) => (
            <div
              className="overflow-hidden bg-white shadow mt-5 sm:rounded-lg"
              key={message.id}
            >
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Acompanhamento
                      <p>
                        {intlFormat(
                          message.create_at,
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
                      </p>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-medium">
                      {message.title}
                    </dd>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {message.text}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="border-t">
                <dl>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
                    <dt className="text-sm font-medium text-gray-500">
                      Responsavel
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {message.user?.name}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ))
        : ""}
    </Section>
  );
}
