"use client";

import api from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { LoadingModal } from "../loadingModal";

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
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [filterYear, setFilterYear] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function fetchStudents() {
      setIsLoading(true);
      try {
        const res = await api.get("/Users/all");
        setStudents(res.data.users);

        // then fetch already assigned IDs
        const assigned = await api.get(
          `/requirementset/${requirementSetId}/studentIds`
        );

        console.log(assigned.data.studentIds);

        setSelectedStudentIds(assigned.data.studentIds ?? []);
      } catch (error) {
        toast.error("Failed to fetch students.");
        console.error("Failed to fetch students.", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudents();
  }, [requirementSetId]);

  const handleSelect = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  function handleYearSelect(selection: string) {
    setFilterYear(selection);
    if (selection === "custom") {
      setSelectedStudentIds([]);
    } else {
      let eligible = students;

      if (selection === "5+") {
        eligible = eligible.filter((s) => s.yearLevel >= 5);
      } else if (selection) {
        eligible = eligible.filter((s) => s.yearLevel.toString() === selection);
      }
      setSelectedStudentIds(eligible.map((s) => s.id));
    }
  }

  const handleAssign = async () => {
    setIsLoading(true);

    if (selectedStudentIds.length === 0) {
      toast.error("Please select at least 1 student.");
      setIsLoading(false);
      return;
    }

    try {
      await api.put(`/RequirementSet/${requirementSetId}/assign-students`, {
        StudentIds: selectedStudentIds,
      });

      toast.success("Requirements successfully assigned.");
      onClose();
    } catch (error) {
      toast.error("Failed to assign requirements.");
      console.error("Failed to assign requirements.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.5] p-4">
      {isLoading && <LoadingModal />}
      <div className="bg-gray-100 p-6 rounded-md w-full h-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h1 className="text-lg sm:text-xl font-semibold font-vogue leading-4">
          Assign Requirement Set to Students
        </h1>
        <p className="mb-2 sm:mb-4 mt-1 leading-4">
          All students can be made to comply requirements.
        </p>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex flex-row justify-between items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search student by name..."
              className="p-2 border rounded-md flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <button
              disabled
              className="text-black rounded-md text-2xl hover:text-gray-500 cursor-pointer"
            >
              <BiSearch />
            </button> */}
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

        {/* Student List */}
        <ul className="flex-1 max-h-96 overflow-y-auto mb-4 space-y-2">
          {students
            .filter((s) => {
              if (searchTerm) {
                const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                if (!fullName.includes(searchTerm.toLowerCase())) return false;
              }
              if (filterYear === "" || filterYear === "custom") return true;
              if (filterYear === "5+") return s.yearLevel >= 5;
              return s.yearLevel.toString() === filterYear;
            })
            .map((s) => (
              <li
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className={`flex items-center p-2 ${
                  selectedStudentIds.length > 0 &&
                  selectedStudentIds.includes(s.id)
                    ? `bg-blue-200 hover:bg-blue-300`
                    : `bg-gray-200 hover:bg-gray-300`
                } rounded-md space-x-4 cursor-pointer`}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={selectedStudentIds.includes(s.id)}
                  onClick={(e) => e.stopPropagation()}
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
              </li>
            ))}
        </ul>

        {/* Actions */}
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
