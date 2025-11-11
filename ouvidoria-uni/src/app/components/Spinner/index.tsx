import { FaSpinner } from "react-icons/fa";

export default function Spinner() {
  return (
    <div className="flex flex-1 items-center text-xl">
      <FaSpinner className="animate-spin m-auto" />
    </div>
  );
}
