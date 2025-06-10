"use client";
import { useState } from "react";
import { BiSolidCommentError } from "react-icons/bi";

type Requirement = {
  id: number;
  name: string;
  file?: File | null;
  status: "Verified" | "Pending" | "Missing";
  adminComment?: {
    text: string;
    author: string;
  };
};

type RequirementGroup = {
  schoolYear: string;
  semester: "1st Semester" | "2nd Semester";
  deadline: Date;
  requirements: Requirement[];
};

const initialRequirementGroups: RequirementGroup[] = [
  {
    schoolYear: "2022-2023",
    semester: "1st Semester",
    deadline: new Date("2023-08-15"),
    requirements: [
      {
        id: 1,
        name: "Transcript of Records",
        file: null,
        status: "Missing",
        adminComment: {
          text: "File was blurry, please re-upload.",
          author: "Ms. Santos",
        },
      },
      {
        id: 2,
        name: "Certificate of Enrollment",
        file: null,
        status: "Missing",
      },
    ],
  },
  {
    schoolYear: "2022-2023",
    semester: "2nd Semester",
    deadline: new Date("2024-01-30"),
    requirements: [
      {
        id: 3,
        name: "ID Picture",
        file: null,
        status: "Missing",
      },
    ],
  },
];

export default function RequirementsTracker() {
  const [requirementGroups, setRequirementGroups] = useState<
    RequirementGroup[]
  >(initialRequirementGroups);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
    reqId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRequirementGroups((prevGroups) =>
      prevGroups.map((group, gIdx) => {
        if (gIdx !== groupIndex) return group;
        return {
          ...group,
          requirements: group.requirements.map((req) =>
            req.id === reqId ? { ...req, file, status: "Pending" } : req
          ),
        };
      })
    );
  };

  const getStatusColor = (status: Requirement["status"]) => {
    switch (status) {
      case "Verified":
        return "text-green-600";
      case "Pending":
        return "text-yellow-500";
      case "Missing":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="w-full md:p-6 bg-white md:shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Requirements Tracker
      </h2>

      {requirementGroups.map((group, groupIndex) => (
        <div key={`${group.schoolYear}-${group.semester}`} className="mb-8">
          <div className="mb-2 md:mb-4">
            <h3 className="text-lg font-semibold text-blue-800">
              SY {group.schoolYear} – {group.semester}
            </h3>
            <p className="text-sm text-gray-500">
              Deadline: {formatDate(group.deadline)}
            </p>
          </div>

          <div className="space-y-2 md:space-y-4">
            {group.requirements.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-2 p-4 border rounded-md bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 font-medium text-gray-700 font-creato text-sm md:text-base">
                    {req.name}
                  </div>

                  <div>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, groupIndex, req.id)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer justify-self-end md:self-auto"
                    />
                  </div>

                  <div
                    className={`text-sm font-semibold self-end sm:self-center ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </div>
                </div>

                {req.adminComment && (
                  <div className="flex items-start gap-2 text-sm bg-yellow-50 p-2 rounded-md mt-2 border border-yellow-200">
                    <BiSolidCommentError
                      className="mt-0.5 text-yellow-600 w-12"
                      size={20}
                    />
                    <div>
                      <span className="font-semibold font-vogue">
                        Admin Comment:
                      </span>{" "}
                      {req.adminComment.text}{" "}
                      <span className="italic text-xs text-gray-600 font-creato">
                        – {req.adminComment.author}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
