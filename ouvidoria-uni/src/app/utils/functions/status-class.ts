export function getStatusClass(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600";
    case "PROCEDING":
      return "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold bg-yellow-50 text-yellow-600 ";
    case "WAITING":
      return "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold bg-yellow-50 text-yellow-600 ";
    case "NOT_PROCEDING":
      return "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold bg-red-50 text-red-600";
    case "DONE":
      return "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold bg-green-50 text-green-600";
    default:
      return "";
  }
}
