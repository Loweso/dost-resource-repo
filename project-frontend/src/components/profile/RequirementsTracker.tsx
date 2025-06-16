"use client";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { RequirementSet } from "@/types/types";
import { LoadingModal } from "../loadingModal";
import RequirementSetComp from "./RequirementSet";

type RequirementsTrackerProps = {
  userId: string;
};

export default function RequirementsTracker({
  userId,
}: RequirementsTrackerProps) {
  const [sets, setSets] = useState<RequirementSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequirementsForStudent(id: string) {
      setLoading(true);
      try {
        const res = await api.get(`/RequirementSet/user/${id}`);
        setSets(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to retrieve your requirements.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequirementsForStudent(userId);
  }, [userId]);

  return (
    <div className="w-full md:p-6 bg-white md:shadow rounded-lg">
      {loading && <LoadingModal />}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Requirements Tracker
      </h2>

      {sets.length === 0 && <p>No requirements assigned.</p>}

      {sets.map((set) => (
        <RequirementSetComp
          key={set.id}
          set={set}
          setSets={setSets}
          userId={userId}
        />
      ))}
    </div>
  );
}
