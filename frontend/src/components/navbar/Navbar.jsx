"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLink = [
    {
      id: 1,
      name: "Home",
      link: "/",
    },
    {
      id: 2,
      name: "Self_Help",
      link: "/self-help",
    },
    {
      id: 3,
      name: "Chat",
      link: "/chat",
    },
    {
      id: 4,
      name: "REC",
      link: "/rec",
    },
  ];

  return (
    <nav className="bg-primary py-4 px-16 w-full flex shadow-md backdrop-blur-sm border-b-2 border-zinc-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href={"/"} className="text-white font-bold text-2xl">
            Logo
          </Link>
        </div>
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.707 6.293a1 1 0 0 1 1.414 0L12 10.586l3.879-3.88a1 1 0 1 1 1.415 1.414L13.414 12l3.88 3.879a1 1 0 0 1-1.414 1.415L12 13.414l-3.879 3.88a1 1 0 0 1-1.415-1.414L10.586 12 6.707 8.121a1 1 0 0 1 0-1.414z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6h16v2H4V6zm0 7h16v2H4v-2zm0 5h16v2H4v-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`${isOpen ? "block" : "hidden"}  lg:flex lg:items-center`}
      >
        <div className="text-sm flex lg:flex-grow">
          {navLink.map((data) => (
            <Link
              key={data.id}
              href={data.link}
              className={`block mt-4 mx-4 text-base lg:inline-block lg:mt-0  hover:text-white hover:scale-110 ${
                pathname === data.link
                  ? "border-b-2 text-white"
                  : "text-[#b0adad]"
              }`}
            >
              {data.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
