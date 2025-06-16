"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import api from "@/lib/api";

import { LoadingModal } from "../loadingModal";
import AdminSidebar from "./AdminSideBar";
import { RequirementTrackerDropdown } from "./RequirementTrackerDropdown";
import { StudentList } from "./RequirementTrackerStudentList";
import { Pagination } from "./RequirementTrackerPagination";
import { IoSearchCircle } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";

import { SimpleStudent, RequirementSet } from "@/types/types";

export default function RequirementTrackerPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [requirementSets, setRequirementSets] = useState<RequirementSet[]>([]);
  const [selectedRequirementSetId, setSelectedRequirementSetId] = useState<
    number | undefined
  >(0);
  const [filterText, setFilterText] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [students, setStudents] = useState<SimpleStudent[]>([]);
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    async function fetchRequirementSets() {
      try {
        const res = await api.get("/RequirementSet/getAllSimple");

        setRequirementSets(res.data);
        if (res.data.length > 0) {
          res.data.sort(
            (a: RequirementSet, b: RequirementSet) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
          setSelectedRequirementSetId(res.data[res.data.length - 1].id);
          setFilterText(res.data[res.data.length - 1].title);
        }
      } catch (error) {
        console.error("Error fetching requirement sets", error);
      }
    }
    fetchRequirementSets();
  }, []);

  useEffect(() => {
    async function fetchStudents() {
      if (!selectedRequirementSetId) return;

      setIsLoading(true);
      try {
        const res = await api.get(
          `/Users/getAll?requirementSetId=${selectedRequirementSetId}&page=${currentPage}&pageSize=${pageSize}&search=${encodeURIComponent(
            searchQuery
          )}`
        );
        setStudents(res.data.students);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Error fetching students", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, [selectedRequirementSetId, currentPage, searchQuery]);

  return (
    <div className="flex h-screen w-screen sm:w-auto">
      <AdminSidebar />
      <Toaster />
      <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        {isLoading && <LoadingModal />}
        <div className="w-full shadow-lg rounded-lg p-3 sm:p-6 border border-gray-200 mt-16 sm:mt-4 overflow-auto">
          <h2 className="text-lg sm:text-2xl font-vogue mb-2">
            Requirement Tracker Panel
          </h2>
          <div className="flex flex-col flex-wrap md:flex-row items-center justify-between">
            <RequirementTrackerDropdown
              requirementSets={requirementSets}
              filterText={filterText}
              showDropdown={showDropdown}
              onSelect={(id, title) => {
                setSelectedRequirementSetId(id);
                setFilterText(title);
                setShowDropdown(false);
              }}
              onSearchChange={(text) => setFilterText(text)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
              onFocus={() => setShowDropdown(true)}
            />

            <div className="flex flex-row self-end -mt-2 md:mt-0">
              <div className="text-gray-300 s mr-2">
                <FaUserAlt size={40} className="h-8 md:h-auto" />
              </div>
              <input
                type="text"
                placeholder="Search by name (First, Middle, Last)"
                value={searchStudent}
                onChange={(e) => {
                  setSearchStudent(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-2 pl-2 border-y border-l mb-4 text-xs md:text-base"
              />
              <button
                onClick={() => setSearchQuery(searchStudent)}
                className="bg-blue-500 text-blue-500 hover:bg-blue-700 cursor-pointer mb-4 mr-2 md:mr-0 border rounded-r-lg"
              >
                <IoSearchCircle
                  size={40}
                  className="text-white h-8 md:h-auto"
                />
              </button>
            </div>
          </div>

          <StudentList
            students={students}
            requirementSetID={selectedRequirementSetId ?? 0}
          />

          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
}
