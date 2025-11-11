export function getStatusTranslate(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "Em Atendimento";
    case "PROCEDING":
      return "Procedente";
    case "NOT_PROCEDING":
      return "Não Procede";
    case "DONE":
      return "Finalizado";
    case "WAITING":
      return "Aguardando";
    default:
      return "";
  }
}
