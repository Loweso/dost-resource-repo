"use client";
import { RequirementSet } from "@/types/types";
import RequirementItem from "./RequirementItem";

type RequirementSetProps = {
  set: RequirementSet;
  setSets: React.Dispatch<React.SetStateAction<RequirementSet[]>>;
  userId: string;
};

export default function RequirementSetComp({
  set,
  setSets,
  userId,
}: RequirementSetProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mb-8">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-blue-800 leading-4 font-creato">
          {set.title}
        </h3>
        <p className="text-sm text-gray-500">
          Deadline: {formatDate(set.deadline)}
        </p>
      </div>

      <div className="space-y-2">
        {set.requirements.map((req) => (
          <RequirementItem
            key={req.id}
            requirement={req}
            setId={set.id}
            setSets={setSets}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}
