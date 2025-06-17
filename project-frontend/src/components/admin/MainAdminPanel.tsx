"use client";

import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import api from "@/lib/api";
import { LoadingModal } from "../loadingModal";
import AdminSidebar from "./AdminSideBar";
import { FaKey } from "react-icons/fa";
import Image from "next/image";
import { UserStore } from "@/store/user";

type User = {
  id: number;
  profileImageUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  yearLevel: number;
  role: string;
};

export default function MainAdminPanel() {
  const { isLoggedIn, userId } = UserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("Student");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);

  async function handleSearch() {
    if (!searchTerm.trim()) {
      toast.error("Please input a search query.");
      return;
    }

    setIsLoading(true);
    try {
      setCurrentPage(1);
      const res = await api.get("/users", {
        params: { search: searchTerm, page: currentPage, pageSize },
      });
      console.log(res.data);
      setUsers(res.data.users || []);
      setTotalPages(Math.ceil(res.data.total / pageSize));
    } catch (error) {
      console.error(error);
      toast.error("Failed to search.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFinalizeRole(id: number) {
    if (!isLoggedIn) {
      toast.error("Please log in.");
      return;
    }
    if (newRole === "") {
      toast.error("Please select a role.");
      return;
    }
    if (password !== confirmPass) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      console.log(password);
      await api.patch(`/users/${id}`, {
        adminId: userId,
        role: newRole,
        password,
      });
      toast.success("User role updated.");
      setSelectedUser(null);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen sm:w-auto">
      <AdminSidebar />
      <Toaster />
      <div className="flex-1 p-4 sm:p-6 md:p-10 mt-16 overflow-y-auto">
        {isLoading && <LoadingModal />}
        <h2 className="text-lg sm:text-2xl font-vogue">Permissions Panel</h2>
        <p className="text-xs sm:text-base mb-2 sm:mb-4">
          For users you might want to provide Admin access, you may search for
          them here.
        </p>
        <div className="flex mb-4">
          <input
            className="flex-1 p-2 border rounded-l text-sm sm:text-base"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-gray-100 rounded-r text-sm sm:text-base border-blue-500 hover:bg-blue-600 cursor-pointer"
          >
            Search
          </button>
        </div>

        {users.length > 0 ? (
          <div className="flex flex-col gap-4">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row items-center p-4 border rounded-md shadow-md"
              >
                <Image
                  src={u.profileImageUrl || "/images/default_avatar.png"}
                  width={100}
                  height={100}
                  alt="Profile"
                  className="w-8 h-8 sm:w-12 sm:h-12 mr-4 rounded-full"
                />

                <div className="flex-1 leading-4 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold">
                    {u.firstName} {u.middleName} {u.lastName}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500">
                    Year Level: {u.yearLevel} — Role: {u.role}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setNewRole(u.role);
                  }}
                  className="p-1 sm:p-2 hover:bg-gray-600 bg-gray-500 text-gray-100 rounded flex items-center gap-1 cursor-pointer mt-2 sm:mt-0"
                >
                  <FaKey /> Manage Site Role
                </button>
              </div>
            ))}
            <div className="flex justify-center gap-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="p-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="p-4 text-center">No results</p>
        )}

        {/* Modal Section */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="rounded-md w-11/12 max-w-3xl">
              <div className="flex flex-col md:flex-row rounded-xl overflow-hidden">
                <div className="relative flex flex-col items-center justify-center text-white p-8 flex-1">
                  <div className="absolute inset-0 ocean-bg"></div>
                  <Image
                    src={
                      selectedUser.profileImageUrl ||
                      "/images/default_avatar.png"
                    }
                    width={100}
                    height={100}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mb-4"
                  />
                  <h2 className="text-xl font-semibold text-center leading-5 mb-2">
                    {selectedUser.firstName} {selectedUser.middleName}{" "}
                    {selectedUser.lastName}
                  </h2>
                  <p className="text-sm sm:text-base">
                    Year: {selectedUser.yearLevel}
                  </p>
                  <p className="text-sm sm:text-base">
                    Current Role: {selectedUser.role}
                  </p>
                </div>

                {/* Right side (Role, password) */}
                <div className="flex-1 p-8 bg-white">
                  <label className="block mb-2">
                    Role:
                    <select
                      className="p-2 border rounded w-full"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="Student">Student</option>
                      <option value="StudentAdmin">Student-Admin</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </label>

                  <label className="block mb-2">
                    YOUR Password:
                    <input
                      type="password"
                      className="p-2 border rounded w-full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>

                  <label className="block mb-2">
                    Confirm YOUR Password:
                    <input
                      type="password"
                      className="p-2 border rounded w-full"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </label>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleFinalizeRole(selectedUser.id)}
                      className="flex gap-2 sm:gap-4 items-center p-2 bg-green-500 text-gray-100 rounded flex-1 leading-4 hover:bg-green-600 cursor-pointer"
                    >
                      <FaKey size={25} /> Finalize Site Role
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="p-2 bg-gray-500 text-gray-100 rounded flex-1 hover:bg-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
