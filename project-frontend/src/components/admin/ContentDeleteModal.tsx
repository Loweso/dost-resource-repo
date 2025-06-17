import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiDeleteBin3Fill } from "react-icons/ri";
import api from "@/lib/api";

interface DeleteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: number;
  articleTitle: string;
  onDeleted: () => void;
}

export default function DeleteContentModal({
  isOpen,
  onClose,
  articleId,
  articleTitle,
  onDeleted,
}: DeleteContentModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/articles/${articleId}`);

      toast.success("Article successfully deleted.");
      onDeleted();
      onClose();
    } catch (error) {
      console.error("Error removing article", error);
      toast.error("Failed to delete article.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 max-w-screen bg-black/50 overflow-hidden">
      <div className="bg-gray-100 p-4 sm:p-6 rounded-md shadow-md w-full max-w-md text-sm sm:text-base">
        <h1 className="font-vogue text-lg sm:text-2xl">DELETE ARTICLE</h1>
        <h2 className="mb-4">
          Really want to delete{" "}
          <span className="font-semibold text-base sm:text-lg">
            {articleTitle}
          </span>
          ? <br />
          <br /> Once deleted, it&apos;s deleted{" "}
          <span className="text-red-500 font-bold">FOREVER</span>!
        </h2>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 p-2 bg-red-500 hover:bg-red-600 text-gray-100 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RiDeleteBin3Fill />
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 bg-gray-500 hover:bg-gray-600 text-gray-100 rounded-md disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
