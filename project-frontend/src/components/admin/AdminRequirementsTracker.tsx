"use client";

import { useState } from "react";
import AdminAddRequirementSetModal from "./AdminAddRequirementSetModal";

export default function AdminRequirementsTracker({ students }) {
  const [isAddReqSetModalOpen, setIsAddReqSetModalOpen] = useState(false);

  return (
    <div className="py-16 max-w-4xl mx-auto">
      {isAddReqSetModalOpen && (
        <AdminAddRequirementSetModal
          onClose={() => setIsAddReqSetModalOpen(false)}
        />
      )}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Student or Semester"
          className="flex-1 p-2 border rounded-md shadow-sm"
        />
        <input
          type="text"
          placeholder="Semester"
          className="flex-1 p-2 border rounded-md shadow-sm"
        />
        <button
          className="bg-blue-300 p-2 hover:bg-blue-400 cursor-pointer"
          onClick={() => setIsAddReqSetModalOpen(true)}
        >
          Add New Requirements Set
        </button>
      </div>

      {students?.map((student, i) => (
        <div key={i} className="mb-6 p-4 border rounded-md shadow-md">
          {/* Student Header */}
          <div className="flex items-center mb-4">
            <div className="flex-none mr-4 w-12 h-12 rounded-full border flex items-center justify-center text-lg font-semibold">
              {student?.name?.[0]}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{student?.name}</h3>
              <p className="text-gray-500">Year Level: {student?.yearLevel}</p>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="space-y-4">
            {student?.requirements?.map((req, j) => (
              <div key={j} className="p-4 border rounded-md">
                {/* Title, File, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Title and File View */}
                  <div className="flex-1">
                    <span className="font-semibold block mb-2">
                      {req?.title}
                    </span>

                    <a
                      href={req?.fileURL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View File
                    </a>
                  </div>

                  {/* Actions Section */}
                  <div className="flex items-center gap-2">
                    <select
                      defaultValue={req?.status?.toLowerCase()}
                      className="p-1 border rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button className="p-1 px-2 border rounded-md">
                      Comment
                    </button>
                  </div>
                </div>

                {/* Comment Section */}
                {req?.comment && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center mb-2">
                      <div className="flex-none mr-2 w-10 h-10 rounded-full border flex items-center justify-center">
                        {req?.comment?.admin?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {req?.comment?.admin?.name} <span>(Admin)</span>
                        </p>
                      </div>
                    </div>
                    <p>{req?.comment?.text}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button className="p-1 px-2 border rounded-md">
                        Edit
                      </button>
                      <button className="p-1 px-2 border rounded-md">
                        Delete
                      </button>
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
