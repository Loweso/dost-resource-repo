"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { UserStore } from "@/store/user";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, userId } = UserStore();
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const handleProfile = async () => {
    if (isLoggedIn) {
      router.push(`/users/${userId}`);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <nav className="hidden md:inline w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <Link href="/" className="w-48 group cursor-pointers">
            <div className="flex flex-row items-center justify-center transition-transform duration-200 ease-in-out group-hover:-translate-y-1 gap-4">
              <Image
                src="/images/logo.png"
                alt="Website Logo"
                width={60}
                height={60}
                className="object-contain cursor-pointer"
              />
              <p className="font-vogue text-lg leading-5 hidden sm:block">
                DOST SA
                <br />
                UP CEBU
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="cursor-pointer">
              <span className="text-gray-700 hover:text-black font-medium">
                About
              </span>
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="cursor-pointer">
                <span className="text-gray-700 hover:text-black font-medium">
                  Log in
                </span>
              </Link>
            )}

            {isLoggedIn && (
              <button
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer"
                onClick={handleProfile}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14a6 6 0 100-12 6 6 0 000 12zM4 20a8 8 0 1116 0H4z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed w-10 h-10 rounded-md bg-white shadow-md flex items-center justify-center text-gray-800 right-5 top-5 z-40"
      >
        <FaBars className="w-5 h-5" />
      </button>

      {menuOpen && (
        <div className="fixed md:hidden inset-0 bg-white z-50 flex flex-col items-start p-8 space-y-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-600 text-xl self-end"
          >
            ✕
          </button>

          <Link href="/" onClick={() => setMenuOpen(false)}>
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo.png"
                alt="Website Logo"
                width={50}
                height={50}
              />
              <p className="font-vogue text-xl">DOST SA UP CEBU</p>
            </div>
          </Link>
          <div className="flex flex-col">
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 text-lg font-medium"
            >
              About
            </Link>

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 text-lg font-medium"
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
