"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { FaSearch } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { HiTrash } from "react-icons/hi2";

import AdminAddRequirementSetModal from "./AdminAddRequirementSetModal";
import AdminEditRequirementSetModal from "./AdminEditRequirementSetModal";
import AdminDeleteRequirementSetModal from "./AdminDeleteRequirementSetModal";
import { LoadingModal } from "../loadingModal";
import AdminAssignRequirementsModal from "./AdminAssignRequirementSetModal";
import AdminSidebar from "./AdminSideBar";

type Requirement = {
  id: number;
  title: string;
};

type RequirementSet = {
  id: number;
  title: string;
  deadline: string;
  requirements: Requirement[];
};

export default function RequirementSetPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSets, setFilteredSets] = useState<RequirementSet[]>([]);

  const [isAddReqSetModalOpen, setIsAddReqSetModalOpen] = useState(false);
  const [assignTargetId, setAssignTargetId] = useState<number | null>(null);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    setIsLoading(true);
    fetchRequirementSets(1, pageSize, "");
    setIsLoading(false);
  }, []);

  const fetchRequirementSets = async (
    page = 1,
    pageSize = 10,
    searchTerm: string
  ) => {
    setIsLoading(true);
    try {
      const res = await api.get("/RequirementSet", {
        params: { pageNumber: page, pageSize, searchTerm },
      });

      setFilteredSets(res.data.data);
      setCurrentPage(res.data.pageNumber);
      setTotalItems(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen sm:w-auto">
      <AdminSidebar />
      <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-10 items-center flex-1">
        {isLoading && <LoadingModal />}
        {isAddReqSetModalOpen && (
          <AdminAddRequirementSetModal
            onClose={() => setIsAddReqSetModalOpen(false)}
          />
        )}

        <div className="w-full shadow-lg rounded-lg p-3 sm:p-6 border border-gray-200 mt-16 sm:mt-4">
          <h2 className="text-lg sm:text-2xl font-semibold font-vogue mb-2">
            Requirement Set Panel
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setIsAddReqSetModalOpen(true)}
              className="text-sm sm:text-base w-full sm:w-32 px-4 py-2 text-gray-50 bg-green-500 rounded-md leading-4 hover:bg-green-600 cursor-pointer"
            >
              + Add New
            </button>

            <div className="w-full flex flex-row">
              <input
                className="flex-1 p-2 border rounded-md text-sm md:text-base"
                placeholder="Search by Title or Requirement"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => fetchRequirementSets(1, pageSize, searchTerm)}
                className="px-2 md:px-4 py-2 text-black hover:opacity-50 text-2xl md:text-4xl rounded-md cursor-pointer"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredSets && filteredSets.length ? (
              filteredSets.map((set) => (
                <div
                  key={set.id}
                  className="p-2 sm:p-4 bg-gray-100 rounded-md shadow-md"
                >
                  {editTargetId === set.id && (
                    <AdminEditRequirementSetModal
                      requirementSetId={set.id}
                      onClose={() => setEditTargetId(null)}
                    />
                  )}
                  {deleteTargetId === set.id && (
                    <AdminDeleteRequirementSetModal
                      requirementSetId={set.id}
                      requirementTitle={set.title}
                      onClose={() => setDeleteTargetId(null)}
                    />
                  )}
                  {assignTargetId === set.id && (
                    <AdminAssignRequirementsModal
                      requirementSetId={set.id}
                      requirementTitle={set.title}
                      onClose={() => setAssignTargetId(null)}
                    />
                  )}

                  <h3 className="text-md sm:text-lg font-semibold mb-2 font-creato">
                    {set.title}
                  </h3>
                  <p className="text-sm sm:text-base mb-2">
                    Deadline: {new Date(set.deadline).toLocaleString()}
                  </p>

                  <ul className="text-sm sm:text-base mb-4 ml-4 list-disc">
                    {set.requirements?.map((req) => (
                      <li key={req.id}>{req.title}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAssignTargetId(set.id)}
                      className="text-sm sm:text-base px-3 py-1 text-gray-50 bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer"
                    >
                      Assign to Students
                    </button>

                    <button
                      onClick={() => setEditTargetId(set.id)}
                      className="flex items-center text-sm sm:text-base px-3 py-1 text-gray-50 bg-yellow-500 rounded-md hover:bg-yellow-600 cursor-pointer"
                    >
                      <RiEdit2Fill className="w-4 h-4 mr-0" />
                      <span className="hidden sm:inline ml-2">
                        Edit Requirement Set
                      </span>
                    </button>

                    <button
                      onClick={() => setDeleteTargetId(set.id)}
                      className="flex items-center text-sm sm:text-base px-3 py-1 text-gray-50 bg-red-500 rounded-md hover:bg-red-600 cursor-pointer"
                    >
                      <HiTrash className="w-4 h-4 mr-0" />
                      <span className="hidden sm:inline ml-2">
                        Delete Requirement Set
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div>No requirement sets found</div>
            )}
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            {currentPage > 1 && (
              <button
                onClick={() =>
                  fetchRequirementSets(currentPage - 1, pageSize, searchTerm)
                }
                className="px-4 py-2 text-gray-50 bg-gray-500 rounded-md hover:bg-gray-600 cursor-pointer"
              >
                ← Previous
              </button>
            )}

            {currentPage < totalPages && (
              <button
                onClick={() =>
                  fetchRequirementSets(currentPage + 1, pageSize, searchTerm)
                }
                className="px-4 py-2 text-gray-50 bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
