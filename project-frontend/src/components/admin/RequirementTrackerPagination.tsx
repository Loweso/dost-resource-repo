import React from "react";

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

export function Pagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (total <= pageSize) return null;

  return (
    <div className="flex justify-between mt-4">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 mr-2 bg-gray-500 text-gray-100 rounded-md disabled:opacity-50"
      >
        Previous
      </button>

      <button
        disabled={currentPage * pageSize >= total}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 ml-2 bg-gray-500 text-gray-100 rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
