import React from "react";
import { RequirementSet } from "@/types/types";

interface RequirementTrackerDropdownProps {
  requirementSets: RequirementSet[];
  filterText: string;
  showDropdown: boolean;
  onSelect: (setId: number, title: string) => void;
  onSearchChange: (filterText: string) => void;
  onBlur: () => void;
  onFocus: () => void;
}

export function RequirementTrackerDropdown({
  requirementSets,
  filterText,
  showDropdown,
  onSelect,
  onSearchChange,
  onBlur,
  onFocus,
}: RequirementTrackerDropdownProps) {
  const filtered = requirementSets.filter(
    (set) =>
      set.title.toLowerCase().includes(filterText.toLowerCase()) ||
      set.id.toString().includes(filterText)
  );

  return (
    <div className="relative mb-4 mr-2 w-full md:w-auto md:flex-1">
      <input
        type="text"
        placeholder="Search or select requirement set"
        value={filterText}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className="p-2 w-full sm:w-72 border rounded-t-md focus:outline-0 text-xs md:text-base"
      />

      {showDropdown && (
        <ul className="absolute z-10 w-full sm:w-72 p-2 bg-gray-100 border rounded-b-md shadow-md max-h-60 overflow-auto">
          {filtered.length === 0 && (
            <li className="p-2 text-gray-500">No match</li>
          )}

          {filtered.map((set) => (
            <li
              key={set.id}
              onMouseDown={() => onSelect?.(set.id, set.title)}
              className="p-2 hover:bg-gray-200 cursor-pointer leading-3"
            >
              {set.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
