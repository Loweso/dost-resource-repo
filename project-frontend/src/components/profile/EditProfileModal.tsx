"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

type EditProfileModalProps = {
  id: string;
  profileImageUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  yearLevel: number;
  university: string;
  course: string;
  onClose: () => void;
};

export default function EditProfileModal({
  id,
  profileImageUrl,
  firstName: initialFirstName,
  middleName: initialMiddleName,
  lastName: initialLastName,
  email: initialEmail,
  yearLevel: initialYearLevel,
  university: initialUniversity,
  course: initialCourse,
  onClose,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [middleName, setMiddleName] = useState(initialMiddleName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [yearLevel, setYearLevel] = useState(initialYearLevel);
  const [university, setUniversity] = useState(initialUniversity);
  const [course, setCourse] = useState(initialCourse);

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5090/api/users/${id}`, {
        firstName,
        middleName,
        lastName,
        email,
        yearLevel,
        university,
        course,
      });

      toast.success("Profile updated successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl h-2/3 rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row">
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 p-3 md:p-6">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-blue-500 mb-3">
            <Image
              src={profileImageUrl || "/images/default_avatar.png"}
              alt="Profile Picture"
              width={144}
              height={144}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="h-full w-full flex flex-col p-4 md:p-8 bg-blue-50 text-xs sm:text-base border-t-2 sm:border-t-0 sm:border-l-2 space-y-3 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base md:text-2xl font-semibold text-gray-800">
              Edit Profile
            </h2>
          </div>

          <div className="space-y-2">
            {[
              {
                label: "First Name",
                value: firstName,
                setter: setFirstName as React.Dispatch<
                  React.SetStateAction<string>
                >,
              },
              {
                label: "Middle Name",
                value: middleName,
                setter: setMiddleName as React.Dispatch<
                  React.SetStateAction<string>
                >,
              },
              {
                label: "Last Name",
                value: lastName,
                setter: setLastName as React.Dispatch<
                  React.SetStateAction<string>
                >,
              },
              {
                label: "Email",
                value: email,
                setter: setEmail as React.Dispatch<
                  React.SetStateAction<string>
                >,
              },
              {
                label: "Year Level",
                value: yearLevel,
                setter: setYearLevel as React.Dispatch<
                  React.SetStateAction<number>
                >,
              },
              {
                label: "University",
                value: university,
                setter: setUniversity as React.Dispatch<
                  React.SetStateAction<string>
                >,
              },
              {
                label: "Course",
                value: course,
                setter: setCourse as React.Dispatch<
                  React.SetStateAction<string>
                >,
              },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="font-semibold text-gray-700 block mb-1">
                  {field.label}:
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    field.label === "Year Level"
                      ? (
                          field.setter as React.Dispatch<
                            React.SetStateAction<number>
                          >
                        )(Number(e.target.value))
                      : (
                          field.setter as React.Dispatch<
                            React.SetStateAction<string>
                          >
                        )(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-creato"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-xl hover:bg-gray-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 font-medium cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
