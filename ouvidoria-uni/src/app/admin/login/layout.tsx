import logo from "@/assets/logo.png";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Administração | Ouvidoria UniEvangelica",
  description: "Ouvidoria Faculdade UniEvangelica",
};

export default async function Layout({ children }: { children?: ReactNode }) {
  const session = await getServerSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="flex flex-col p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <div className="flex-row p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            <Image src={logo} alt="logo" priority className="flex mx-auto" />
          </div>
          <div className="shadow w-full rounded-lg divide-y divide-gray-200 bg-white">
            <div className="px-5 py-7">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
