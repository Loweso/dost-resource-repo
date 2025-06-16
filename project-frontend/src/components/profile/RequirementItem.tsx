"use client";

import { ApprovalStatus, Requirement, RequirementSet } from "@/types/types";
import { BiSolidCommentError } from "react-icons/bi";
import toast from "react-hot-toast";
import { useState } from "react";
import FilePreviewModal from "./FilePreviewModal";
import api from "@/lib/api";
import { LoadingModal } from "../loadingModal";
import ViewSubmissionModal from "./ViewSubmissionModal";
import { UserStore } from "@/store/user";

type RequirementItemProps = {
  requirement: Requirement;
  setId: number;
  setSets: React.Dispatch<React.SetStateAction<RequirementSet[]>>;
  userId: string;
};

export default function RequirementItem({
  requirement,
  setId,
  setSets,
  userId,
}: RequirementItemProps) {
  const { userId: currentUserId } = UserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isViewSubmissionOpen, setIsViewSubmissionOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const handleChooseFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = () => {
      setFilePreview(reader.result);
      setIsPreviewModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("setId", setId.toString());
    formData.append("reqId", requirement.id.toString());
    formData.append("userId", userId.toString());

    try {
      await api.post("/Submission/update", formData);
      toast.success("File successfully uploaded.");

      setSets((prev) =>
        prev.map((set) => {
          if (set.id !== setId) return set;
          return {
            ...set,
            requirements: set.requirements.map((req) =>
              req.id === requirement.id
                ? { ...req, submissionStatus: ApprovalStatus.Pending }
                : req
            ),
          };
        })
      );
    } catch (error) {
      toast.error("Failed to submit.");
      console.error("Failed to submit:", error);
    } finally {
      setIsPreviewModalOpen(false);
      setSelectedFile(null);
      setFilePreview(null);
      setIsLoading(false);
      window.location.reload();
    }
  };

  const handleDeleteSubmission = async () => {
    if (!requirement?.id) return;

    setIsLoading(true);
    try {
      await api.delete("/Submission/delete", {
        data: { setId, reqId: requirement.id, userId },
      });
      toast.success("Submission successfully removed.");

      setSets((prev) =>
        prev.map((set) => {
          if (set.id !== setId) return set;
          return {
            ...set,
            requirements: set.requirements.map((req) =>
              req.id === requirement.id
                ? {
                    ...req,
                    submissionStatus: ApprovalStatus.Missing,
                    filePath: undefined,
                  }
                : req
            ),
          };
        })
      );
    } catch (error) {
      toast.error("Failed to delete submission.");
      console.error("Failed to delete submission:", error);
    } finally {
      setIsViewSubmissionOpen(false);
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: ApprovalStatus) => ApprovalStatus[status];
  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.Approved:
        return "text-green-600";
      case ApprovalStatus.Pending:
        return "text-yellow-500";
      case ApprovalStatus.Missing:
        return "text-red-500";
      case ApprovalStatus.Rejected:
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md bg-gray-50">
      {isLoading && <LoadingModal />}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-row items-center justify-between flex-1 font-semibold text-gray-700 font-creato leading-4">
          {requirement.title}
          <div
            className={`sm:hidden ml-4 font-semibold self-end sm:self-center font-coolvetica ${getStatusColor(
              requirement.submission?.approvalStatus ?? 0
            )}`}
          >
            {getStatusLabel(requirement.submission?.approvalStatus ?? 0)}
          </div>
        </div>

        <input
          id={`file-input-${setId}-${requirement.id}`}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleChooseFile(file);
          }}
          className="hidden"
        />
        {currentUserId === userId && (
          <label
            htmlFor={`file-input-${setId}-${requirement.id}`}
            className="px-4 py-2 font-semibold text-blue-700 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
          >
            Choose File
          </label>
        )}

        {currentUserId === userId && requirement.submission?.filePath && (
          <label
            onClick={() => setIsViewSubmissionOpen(true)}
            className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-full ml-2 hover:bg-gray-300 cursor-pointer"
          >
            View submission
          </label>
        )}

        <div
          className={`hidden sm:block text-sm font-semibold self-end sm:self-center ${getStatusColor(
            requirement.submission?.approvalStatus ?? 0
          )}`}
        >
          {getStatusLabel(requirement.submission?.approvalStatus ?? 0)}
        </div>
      </div>

      {requirement.submission?.comments &&
        requirement.submission.comments.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {requirement.submission.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-2 text-sm bg-yellow-50 p-2 rounded-md border border-yellow-300"
              >
                <BiSolidCommentError
                  className="mt-0.5 text-yellow-600 w-12"
                  size={20}
                />
                <div className="w-full flex-1">
                  <span className="font-semibold">
                    {comment.user?.firstName} {comment.user?.lastName}:
                  </span>{" "}
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        )}

      {isPreviewModalOpen && (
        <FilePreviewModal
          filePreview={filePreview}
          isOpen={isPreviewModalOpen}
          onConfirm={handleConfirmSubmit}
          onCancel={() => {
            setIsPreviewModalOpen(false);
            setSelectedFile(null);
            setFilePreview(null);
          }}
        />
      )}

      {isViewSubmissionOpen && (
        <ViewSubmissionModal
          isOpen={isViewSubmissionOpen}
          filePath={requirement.submission?.filePath}
          onDelete={handleDeleteSubmission}
          onClose={() => setIsViewSubmissionOpen(false)}
        />
      )}
    </div>
  );
}
