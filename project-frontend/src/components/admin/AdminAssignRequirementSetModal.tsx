"use client";

import api from "@/lib/api";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { BiSearch } from "react-icons/bi";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  yearLevel: number;
  profileImageUrl: string;
  isVerified: boolean;
};

type AdminAssignRequirementsModalProps = {
  requirementSetId: number;
  requirementTitle: string;
  onClose: () => void;
};

export default function AdminAssignRequirementsModal({
  requirementSetId,
  onClose,
}: AdminAssignRequirementsModalProps) {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [filterYear, setFilterYear] = useState<string>("");

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const res = await api.get("/Users/simple");
      setStudents(res.data);
    } catch (error) {
      toast.error("Failed to fetch students.");
      console.error("Failed to fetch students.", error);
    }
  }

  const handleSelect = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  function handleYearSelect(selection: string) {
    setFilterYear(selection);
    if (selection === "custom") {
      // custom means we do NOT select anyone immediately
      setSelectedStudentIds([]);
    } else {
      // filter first
      let eligible = students;

      if (selection === "5+") {
        eligible = eligible.filter((s) => s.yearLevel >= 5 && s.isVerified);
      } else if (selection) {
        eligible = eligible.filter(
          (s) => s.yearLevel.toString() === selection && s.isVerified
        );
      } else {
        eligible = eligible.filter((s) => s.isVerified);
      }
      // select all eligible IDs immediately
      setSelectedStudentIds(eligible.map((s) => s.id));
    }
  }

  const handleAssign = async () => {
    if (selectedStudentIds.length === 0) {
      toast.error("Please select at least 1 student.");
      return;
    }
    try {
      await api.post("/RequirementSet/assign", {
        requirementSetId,
        studentIds: selectedStudentIds,
      });
      toast.success("Requirements successfully assigned.");
      onClose();
    } catch (error) {
      toast.error("Failed to assign requirements.");
      console.error("Failed to assign requirements.", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.5] p-4">
      <Toaster />
      <div className="bg-gray-100 p-6 rounded-md w-full h-full max-w-2xl">
        <h1 className="text-lg sm:text-xl font-semibold font-vogue leading-4">
          Assign Requirement Set to Students
        </h1>
        <p className="mb-2 sm:mb-4 mt-1 leading-4">
          Only verified users can be made to comply requirements.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex flex-row justify-between items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search student by name..."
              className="p-2 border rounded-md flex-1"
            />
            <button
              disabled
              className="text-black rounded-md text-2xl hover:text-gray-500 cursor-pointer"
            >
              <BiSearch />
            </button>
          </div>

          <select
            id="filterYear"
            onChange={(e) => handleYearSelect(e.target.value)}
            value={filterYear}
            className="p-2 border rounded-md"
          >
            <option value="">All Year Levels</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
            <option value="5+">5th and Above</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <ul className="flex-1 max-h-64 overflow-y-auto mb-4 space-y-2">
          {students.filter((s) => {
            if (filterYear === "" || filterYear === "custom") return true;
            if (filterYear === "5+") return s.yearLevel >= 5;
            return s.yearLevel.toString() === filterYear;
          }).length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Oh no 😕 — there are no students to show.
            </div>
          ) : (
            students
              .filter((s) => {
                if (filterYear === "" || filterYear === "custom") return true;
                if (filterYear === "5+") return s.yearLevel >= 5;
                return s.yearLevel.toString() === filterYear;
              })
              .map((s) => (
                <li
                  key={s.id}
                  className="flex items-center p-2 bg-gray-200 rounded-md space-x-4"
                >
                  <input
                    type="checkbox"
                    disabled={!s.isVerified}
                    checked={selectedStudentIds.includes(s.id)}
                    onChange={() => handleSelect(s.id)}
                  />

                  <Image
                    src={s.profileImageUrl || "/images/default_avatar.png"}
                    width={40}
                    height={40}
                    alt={`${s.firstName} ${s.lastName}`}
                    className="w-10 h-10 mr-2 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="font-creato leading-4 text-sm sm:text-base">
                      {s.firstName ? s.firstName : "N/A"} {s.lastName}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      Year Level: {s.yearLevel}
                    </span>
                  </div>

                  <span className="ml-auto">
                    {s.isVerified ? (
                      <FaCheckCircle
                        color="#4ade80"
                        size={20}
                        className="mr-2"
                      />
                    ) : (
                      <FaCircleXmark
                        color="#ef4444"
                        size={20}
                        className="mr-2"
                      />
                    )}
                  </span>
                </li>
              ))
          )}
        </ul>

        <div className="flex w-full py-4 justify-end gap-4">
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-green-500 text-gray-50 rounded-md hover:bg-green-600 cursor-pointer"
          >
            Assign
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-gray-50 rounded-md hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
