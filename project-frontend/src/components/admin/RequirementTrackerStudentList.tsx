import React, { useState } from "react";
import Image from "next/image";

import { SimpleStudent } from "@/types/types";
import { RequirementTrackerStudentModal } from "./RequirementTrackerStudentModal";

interface StudentListProps {
  students: SimpleStudent[];
  requirementSetID: number;
}

export function StudentList({ students, requirementSetID }: StudentListProps) {
  const [selectedStudent, setSelectedStudent] = useState<SimpleStudent | null>(
    null
  );

  if (students.length === 0) {
    return <p className="text-gray-500">No students found for this set.</p>;
  }

  return (
    <>
      {students.map((student, idx) => (
        <button
          key={idx}
          onClick={() => {
            setSelectedStudent(student);
          }}
          className="flex items-center p-2 sm:p-3 bg-blue-100 hover:bg-blue-200 rounded-md shadow-md mb-2 gap-1 sm:gap-4 cursor-pointer w-full"
        >
          <Image
            src={student.profileImageUrl || "/images/default_avatar.png"}
            alt={student.lastName}
            width={100}
            height={100}
            className="w-10 h-10 sm:w-16 sm:h-16 mr-4 rounded-full object-cover"
          />
          <div>
            <div className="text-left leading-2">
              <span className="text-lg">{student.lastName}</span>,{" "}
              <span className="text-sm font-creato leading-2">
                {student.firstName} {student.middleName}
              </span>
            </div>
            <div className="flex justify-start text-gray-500">
              Year {student.yearLevel}
            </div>
          </div>
        </button>
      ))}

      {selectedStudent && (
        <RequirementTrackerStudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          requirementSetID={requirementSetID}
        />
      )}
    </>
  );
}
