"use client";
import logo from "@/assets/logo.png";
import { Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaBars } from "react-icons/fa";

type Link = {
  label: string | ReactNode | ReactNode[];
  href?: string;
  action?: () => void;
};

const linksBottom: Link[] = [
  { label: "Pagina inicial", href: "/admin" },
  { label: "Sair", action: () => signOut() },
];

const linksAdmin: Link[] = [
  { label: "Categorias", href: "/admin/categorias" },
  { label: "Itens", href: "/admin/items" },
  { label: "Usuários", href: "/admin/usuarios" },
  { label: "Tipos", href: "/admin/tipos" },
  { label: "Relatórios", href: "/admin/relatorios" },
];

export default function HeaderOuvidoria({ role }: { role: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white px-2 md:px-4">
      <div className="grid grid-cols-12 items-start justify-between gap-4 p-4 z-50 relative bg-white">
        <Link href="/admin" className="col-span-6 md:col-span-4">
          <Image src={logo} alt="logo" priority />
        </Link>
        <button
          className="bg-gray-200 p-2 rounded col-span-6 justify-self-end md:hidden focus:ring hover:bg-gray-300 ring-gray-100"
          onClick={handleMenuClick}
        >
          <FaBars className="h-5 w-5 text-gray-600" />
        </button>

        <div className="col-span-12 md:col-span-8 hidden md:block">
          <div>
            <div className="flex flex-wrap justify-end gap-x-4 lg:gap-x-5 mt-10">
              {role === "admin" &&
                linksAdmin.map(({ label, href, action }, index) =>
                  href ? (
                    <Link
                      href={href}
                      key={index}
                      className={[
                        "block font-semibold tracking-tight transform transition-transform ease-in-out hover:translate-x-1",
                        pathname === href ? "text-green-500" : "text-gray-600",
                      ].join(" ")}
                    >
                      {typeof label == "string" ? label.toUpperCase() : label}
                    </Link>
                  ) : (
                    <button
                      className={[
                        "block font-semibold tracking-tight transform transition-transform ease-in-out hover:translate-x-1",
                      ].join(" ")}
                      key={index}
                      onClick={action}
                    >
                      {typeof label == "string" ? label.toUpperCase() : label}
                    </button>
                  )
                )}
              {linksBottom.map(({ label, href, action }, index) =>
                href ? (
                  <Link
                    href={href}
                    key={index}
                    className={[
                      "block font-semibold tracking-tight transform transition-transform ease-in-out hover:translate-x-1",
                      pathname === href ? "text-green-500" : "text-gray-600",
                    ].join(" ")}
                  >
                    {typeof label == "string" ? label.toUpperCase() : label}
                  </Link>
                ) : (
                  <button
                    className={[
                      "block font-semibold tracking-tight transform transition-transform ease-in-out hover:translate-x-1",
                    ].join(" ")}
                    key={index}
                    onClick={action}
                  >
                    {typeof label == "string" ? label.toUpperCase() : label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="block md:hidden p-5">
        <Transition
          show={menuOpen}
          enter="transform transition-transform ease-in-out"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="transform transition-transform ease-in-out"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
        >
          <div className="mb-2">
            {role === "admin" &&
              linksAdmin.map(({ label, href, action }, index) =>
                href ? (
                  <Link
                    href={href}
                    key={index}
                    className={[
                      "block px-4 py-2 font-semibold",
                      pathname?.includes(href) ? "text-blue" : "text-gray-600",
                    ].join(" ")}
                  >
                    {typeof label == "string" ? label.toUpperCase() : label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    className={["block px-4 py-2 font-semibold"].join(" ")}
                    onClick={action}
                  >
                    {typeof label == "string" ? label.toUpperCase() : label}
                  </button>
                )
              )}
            {linksBottom.map(({ label, href, action }, index) =>
              href ? (
                <Link
                  href={href}
                  key={index}
                  className={[
                    "block px-4 py-2 font-semibold",
                    pathname?.includes(href) ? "text-blue" : "text-gray-600",
                  ].join(" ")}
                >
                  {typeof label == "string" ? label.toUpperCase() : label}
                </Link>
              ) : (
                <button
                  key={index}
                  className={["block px-4 py-2 font-semibold"].join(" ")}
                  onClick={action}
                >
                  {typeof label == "string" ? label.toUpperCase() : label}
                </button>
              )
            )}
          </div>
        </Transition>
      </div>
    </header>
  );
}
