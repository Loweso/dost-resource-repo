"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/api";
import { LoadingModal } from "../loadingModal";

type AdminDeleteRequirementSetModalProps = {
  requirementSetId: number;
  requirementTitle: string;
  onClose: () => void;
};

export default function AdminDeleteRequirementSetModal({
  requirementSetId,
  requirementTitle,
  onClose,
}: AdminDeleteRequirementSetModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await api.delete(`/RequirementSet/${requirementSetId}`);

      toast.success("Requirement set successfully deleted.");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete requirement set.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.50] px-4 py-16">
      <Toaster />
      {isLoading && <LoadingModal />}
      <div className="flex flex-col w-full sm:w-1/3 p-6 sm:p-8 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Confirm Delete
        </h2>
        <p className="mb-6">
          Are you sure you want to delete this requirement set: <br />
          <span className="font-creato">{requirementTitle}</span>?
          <br />
          <br />
          <span className="font-semibold text-red-500">
            Once it&apos;s gone, it&apos;s gone forever 😨
          </span>
          .
        </p>

        <div className="flex gap-4 self-end">
          <button
            onClick={onClose}
            className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="p-2 bg-red-500 text-gray-50 rounded-md hover:bg-red-700 cursor-pointer"
          >
            Delete Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
