import { ReactNode } from "react";

export type DataTableProps<T> = {
  titles: ReactNode[];
  data: T[];
  idExtractor: (row: T) => string;
  rowGenerator: (row: T, index: number) => ReactNode[];
};

export default function DataTable<T>({
  titles,
  rowGenerator,
  idExtractor,
  data,
}: DataTableProps<T>) {
  return (
    <div className="m-3 border rounded-2xl bg-white min-w-full overflow-x-auto max-w-full">
      <table className="w-full text-sm text-left overflow-auto">
        <thead className="text-gray-700 uppercase">
          <tr>
            {titles.map((title, index) => (
              <th key={index} className="p-3">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={idExtractor(row)}
              className={rowIndex < data.length - 1 ? "border-b" : ""}
            >
              {rowGenerator(row, rowIndex).map((data, index) => (
                <td key={index} className="p-3">
                  {data}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
