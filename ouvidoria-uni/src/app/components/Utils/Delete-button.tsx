"use client";
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";
import ConfirmationButton from "./Confirmation-button";

export type DeleteButtonProps = { id: number; title: string; url: string };

export default function DeleteButton({ id, title, url }: DeleteButtonProps) {
  const router = useRouter();

  return (
    <ConfirmationButton
      onConfirm={async () => {
        const resp = await fetch(`${url}/${id}`, { method: "DELETE" });

        if (resp.ok) {
          router.refresh();
        }
      }}
      title={title}
      key="delete"
      className="text-white font-bold p-3 bg-red-500 hover:bg-red-600 rounded-lg"
    >
      <FaTrashAlt />
    </ConfirmationButton>
  );
}
