"use client";

import Link from "next/link";
import { useState } from "react";
import { IoSettingsSharp, IoSettingsOutline } from "react-icons/io5";
import { UserStore } from "@/store/user";

export default function AdminSidebar() {
  const { role } = UserStore();
  const [isOpen, setIsOpen] = useState(false);

  if (role === "StudentAdmin") {
    return null;
  }

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed left-2 top-5 p-2 mx-4 text-white bg-gray-800 rounded-md sm:hidden shadow-lg"
      >
        {isOpen ? (
          <IoSettingsSharp size={24} />
        ) : (
          <IoSettingsOutline size={24} />
        )}
      </button>

      <div
        className={`fixed left-0 top-0 bottom-0 w-64 p-6 bg-gray-800 text-gray-100 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out sm:translate-x-0 sm:static sm:flex sm:flex-col top-0 h-screen h-full z-10`}
      >
        <h2 className="text-xl font-creato ml-1 mb-6">Dashboard</h2>
        <ul className="flex flex-col sm:space-y-4">
          <li>
            <Link
              href="/admin/content-management-panel"
              className="p-2 block rounded-md hover:bg-gray-700"
            >
              Content Management Panel
            </Link>
          </li>
          <li>
            <Link
              href="/admin/main/requirement-set-panel"
              className="p-2 block rounded-md hover:bg-gray-700"
            >
              Requirement Set Panel
            </Link>
          </li>
          <li>
            <Link
              href="/admin/main/requirement-tracker-panel"
              className="p-2 block rounded-md hover:bg-gray-700"
            >
              Requirement Tracker Panel
            </Link>
          </li>
          <li>
            <Link
              href="/admin/main/permissions-panel"
              className="p-2 block rounded-md hover:bg-gray-700"
            >
              Permissions Panel
            </Link>
          </li>
        </ul>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 sm:hidden"
        ></div>
      )}
    </>
  );
}
