"use client";
import { useState, useEffect } from "react";
import { BiSolidCommentError } from "react-icons/bi";

type Requirement = {
  id: number;
  title: string;
  file?: File | null;
  submissionStatus: "Verified" | "Pending" | "Missing";
  adminComment?: {
    text: string;
    author: string;
  };
};

type RequirementSet = {
  id: number;
  title: string;
  deadline: string;
  requirements: Requirement[];
};

type RequirementsTrackerProps = {
  userId: string;
};

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];

export default function RequirementsTracker({
  userId,
}: RequirementsTrackerProps) {
  const [sets, setSets] = useState<RequirementSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocked dummy data for testing
    const dummyData: RequirementSet[] = [
      {
        id: 1,
        title: "2025 First Semester Requirements",
        deadline: "2025-06-30T23:59:59Z",
        requirements: [
          { id: 1, title: "Study Load", submissionStatus: "Missing" },
          { id: 2, title: "True Copy of Grades", submissionStatus: "Verified" },
        ],
      },
      {
        id: 2,
        title: "2025 Midyear Requirements",
        deadline: "2025-07-30T23:59:59Z",
        requirements: [
          { id: 3, title: "Internship Report", submissionStatus: "Pending" },
        ],
      },
    ];

    setSets(dummyData);
    setLoading(false);
  }, [userId]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setId: number,
    reqId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      alert("Invalid file format.");
      return;
    }
    setSets((prev) =>
      prev.map((set) => {
        if (set.id !== setId) return set;
        return {
          ...set,
          requirements: set.requirements.map((req) =>
            req.id === reqId
              ? { ...req, file, submissionStatus: "Pending" }
              : req
          ),
        };
      })
    );
  };

  const getStatusColor = (status: Requirement["submissionStatus"]) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div>Loading requirements...</div>;
  }

  return (
    <div className="w-full md:p-6 bg-white md:shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Requirements Tracker
      </h2>

      {sets.length === 0 && <p>No requirements assigned.</p>}

      {sets.map((set) => (
        <div key={set.id} className="mb-8">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-blue-800">{set.title}</h3>
            <p className="text-sm text-gray-500">
              Deadline: {formatDate(set.deadline)}
            </p>
          </div>

          <div className="space-y-2">
            {set.requirements.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-2 p-4 border rounded-md bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 font-semibold text-gray-700">
                    {req.title}
                  </div>

                  <div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, set.id, req.id)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>

                  <div
                    className={`text-sm font-semibold self-end sm:self-center ${getStatusColor(
                      req.submissionStatus
                    )}`}
                  >
                    {req.submissionStatus}
                  </div>
                </div>

                {req.adminComment && (
                  <div className="flex items-start gap-2 text-sm bg-yellow-50 p-2 rounded-md mt-2 border border-yellow-200">
                    <BiSolidCommentError
                      className="mt-0.5 text-yellow-600 w-12"
                      size={20}
                    />
                    <div>
                      <span className="font-semibold">Admin Comment:</span>{" "}
                      {req.adminComment.text}{" "}
                      <span className="italic text-xs text-gray-600">
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
