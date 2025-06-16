import React, { useEffect, useState } from "react";
import ReqTrackerViewSubmissionModal from "./RequirementTrackerViewSubModal";
import { RequirementTrackerCommentModal } from "./RequirementTrackerCommentModal";
import { ApprovalStatus, SimpleStudent } from "@/types/types";
import { FaCommentAlt } from "react-icons/fa";
import { LoadingModal } from "../loadingModal";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

interface RequirementTrackerStudentModalProps {
  student: SimpleStudent;
  onClose: () => void;
  requirementSetID: number;
}

interface SimpleSubmission {
  id: number;
  filePath: string;
  approvalStatus: ApprovalStatus;
}

interface StudentRequirement {
  id: number;
  title: string;
  submission: SimpleSubmission;
}

export function RequirementTrackerStudentModal({
  student,
  onClose,
  requirementSetID,
}: RequirementTrackerStudentModalProps) {
  const [requirements, setRequirements] = useState<StudentRequirement[]>([]);
  const [isViewSubModalOpen, setIsViewSubModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number>(0);
  const [selectedFilePath, setSelectedFilePath] = useState<string | undefined>(
    undefined
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequirements() {
      setLoading(true);
      try {
        const res = await api.get(
          `/Users/${student.id}/requirements?requirementSetId=${requirementSetID}`
        );
        setRequirements(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching student requirements", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRequirements();
  }, [requirementSetID, student]);

  function getSelectClass(approvalStatus: ApprovalStatus) {
    switch (approvalStatus) {
      case ApprovalStatus.Missing:
        return "bg-red-200";
      case ApprovalStatus.Pending:
        return "bg-yellow-200";
      case ApprovalStatus.Approved:
        return "bg-green-200";
      case ApprovalStatus.Rejected:
        return "bg-gray-200";
      default:
        return "bg-red-200";
    }
  }

  function handleApprovalChange(
    submissionId: number,
    requirementId: number,
    newStatus: ApprovalStatus
  ) {
    const previousRequirements = requirements;

    (async () => {
      try {
        await api.put(`/Submission/ApprovalStatus/${submissionId}`, {
          approvalStatus: newStatus,
        });

        setRequirements((prev) =>
          prev.map((item) =>
            item.id === requirementId
              ? {
                  ...item,
                  submission: {
                    ...item.submission,
                    approvalStatus: newStatus,
                  },
                }
              : item
          )
        );
      } catch (error) {
        console.error("Error updating approval status.", error);
        setRequirements(previousRequirements);
      }
    })();
  }

  return (
    <div className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center bg-black/50">
      {loading && <LoadingModal />}
      <div className="bg-gray-100 p-4 sm:p-6 rounded-md shadow-md w-11/12 sm:w-2/3">
        <div className="flex flex-row items-center justify-center pb-3">
          <Image
            src={student.profileImageUrl || "/images/default_avatar.png"}
            alt={student.lastName}
            width={100}
            height={100}
            className="w-10 h-10 mr-4 rounded-full object-cover"
          />
          <Link
            href={`/users/${student.id}`}
            className="text-2xl font-creato leading-5 hover:underline"
          >
            {student.lastName}, {student.firstName} {student.middleName}
          </Link>
        </div>

        <div className="max-h-[60vh] md:max-h-[40vh] overflow-auto">
          {requirements.length === 0 ? (
            <p className="text-gray-500">No requirements found.</p>
          ) : (
            requirements.map((req) => (
              <div
                key={req.id}
                className="flex flex-col md:flex-row items-center mb-2 py-2 px-4 bg-gray-200 rounded-md shadow-md"
              >
                <div className="flex flex-row items-center justify-between w-full">
                  <ReqTrackerViewSubmissionModal
                    isOpen={isViewSubModalOpen}
                    filePath={selectedFilePath}
                    onClose={() => {
                      setIsViewSubModalOpen(false);
                    }}
                  />

                  <RequirementTrackerCommentModal
                    submissionId={selectedSubmissionId}
                    isOpen={isCommentModalOpen}
                    onClose={() => {
                      setIsCommentModalOpen(false);
                    }}
                  />
                  <div className="flex-1 flex-wrap w-auto break-words mr-6">
                    {req.title}
                  </div>

                  <div className="flex flex-row gap-4">
                    <button
                      onClick={() => {
                        setSelectedFilePath(req.submission?.filePath);
                        setIsViewSubModalOpen(true);
                      }}
                      className="hidden md:block px-2 py-1 mr-2 bg-blue-500 hover:bg-blue-600 text-gray-100 rounded-md cursor-pointer"
                    >
                      View submission
                    </button>

                    <select
                      value={
                        req.submission?.approvalStatus ?? ApprovalStatus.Missing
                      }
                      disabled={
                        req.submission === undefined || req.submission === null
                      }
                      onChange={(e) =>
                        handleApprovalChange(
                          req.submission?.id,
                          req.id,
                          parseInt(e.target.value) as ApprovalStatus
                        )
                      }
                      className={`px-2 py-1 mr-2 h-9 border rounded-md ${getSelectClass(
                        req.submission?.approvalStatus ?? ApprovalStatus.Missing
                      )}`}
                    >
                      <option value={0} className="text-red-500">
                        Missing
                      </option>
                      <option value={1} className="text-yellow-500">
                        Pending
                      </option>
                      <option value={2} className="text-green-600">
                        Approved
                      </option>
                      <option value={3} className="text-gray-500">
                        Rejected
                      </option>
                    </select>

                    <button
                      onClick={() => {
                        if (req.submission == null) {
                          toast("🔵 No submission to comment on yet!");
                        } else {
                          setSelectedSubmissionId(req.submission?.id);
                          setIsCommentModalOpen(true);
                        }
                      }}
                      className="hidden md:block text-yellow-700 hover:opacity-50 cursor-pointer"
                    >
                      <FaCommentAlt />
                    </button>
                  </div>
                </div>
                <div className="md:hidden flex flex-row gap-2 mt-2 w-full">
                  <button
                    onClick={() => {
                      setSelectedFilePath(req.submission?.filePath);
                      setIsViewSubModalOpen(true);
                    }}
                    className="md:hidden w-full px-2 py-1 mr-2 bg-blue-500 hover:bg-blue-600 text-gray-100 rounded-md cursor-pointer"
                  >
                    View submission
                  </button>
                  <button
                    onClick={() => {
                      if (req.submission == null) {
                        toast("🔵 No submission to comment on yet!");
                      } else {
                        setSelectedSubmissionId(req.submission?.id);
                        setIsCommentModalOpen(true);
                      }
                    }}
                    className="md:hidden text-yellow-700 hover:opacity-50 cursor-pointer"
                  >
                    <FaCommentAlt />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-500 hover:bg-slate-600 text-gray-100 rounded-md cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
