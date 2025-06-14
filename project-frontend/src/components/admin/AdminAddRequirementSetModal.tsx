"use client";

import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import React, { useState } from "react";
import { FaTrash, FaSave } from "react-icons/fa";
import { LoadingModal } from "../loadingModal";

type AdminAddRequirementSetModalProps = {
  onClose: () => void;
};

export default function AdminAddRequirementSetModal({
  onClose,
}: AdminAddRequirementSetModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [setName, setSetName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [requirements, setRequirements] = useState([""]);

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!setName.trim()) {
      toast.error("Requirement set name is required.");
      return;
    }
    if (!deadline) {
      toast.error("Deadline is required.");
      return;
    }
    if (requirements.some((r) => !r.trim())) {
      toast.error("All requirements must be filled in.");
      return;
    }
    if (requirements.length === 0) {
      toast.error("These must be at least one requirement.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/RequirementSet", {
        title: setName,
        deadline,
        requirements,
      });

      toast.success("Requirement set successfully created.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add requirement set.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.50] px-4 py-16">
      <Toaster />
      {isLoading && <LoadingModal />}
      <div className="flex flex-col md:flex-row w-full h-full sm:w-2/3 rounded-lg shadow-md overflow-scroll md:overflow-auto">
        <div className="relative flex flex-col w-full md:w-1/2 p-6 sm:p-8 text-white">
          <div className="absolute ocean-bg"></div>
          <h2 className="text-lg sm:text-xl font-semibold font-vogue">
            Add New Requirement Set
          </h2>
          <label className="font-creato text-sm text-gray-50 leading-4">
            A requirement set is a group of requirements that DOST scholars must
            have to submit and/or comply to abide by their responsibilities for
            the DOST scholarship with which they have availed.
          </label>
          <br />
          <label className="font-creato">Requirement Set Name </label>
          <label className="text-sm text-gray-50 leading-4">
            (e.g. SY 2024-2025 1st Semester Requirements)
          </label>
          <input
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder="Requirement Set Name"
            className="border p-2 w-full mb-4 bg-white placeholder:text-gray-500 text-black"
          />

          <label className="font-creato">Date Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 w-full mb-4 bg-white placeholder:text-gray-500 text-black"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2 p-4 sm:p-8 bg-gray-100 md:flex-1 md:overflow-auto">
          <label className="font-creato font-bold">Requirements </label>
          {requirements.map((req, i) => (
            <div
              key={i}
              className="flex items-center bg-blue-100 p-2 sm:p-4 mt-4 rounded-lg shadow-lg"
            >
              <input
                value={req}
                onChange={(e) => handleRequirementChange(i, e.target.value)}
                placeholder="New Requirement Name"
                className="flex-1 p-2 mr-2 border-b-2 border-gray-500 w-full"
              />
              <button
                onClick={() => handleRemoveRequirement(i)}
                aria-label="Remove requirement"
                className="p-2 text-black opacity-75 cursor-pointer hover:opacity-100"
              >
                <FaTrash />
              </button>
            </div>
          ))}

          <button
            onClick={handleAddRequirement}
            className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-gray-50 rounded my-4 cursor-pointer"
          >
            + Add New Requirement
          </button>

          <br />
          <div className="flex flex-row w-full gap-4 self-justify-end justify-end">
            <button
              onClick={onClose}
              className="p-2 bg-gray-300 text-black cursor-pointer rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="flex flex-row p-2 bg-blue-500 text-white cursor-pointer rounded-lg hover:bg-blue-600 items-center gap-2"
            >
              <FaSave /> Add Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
