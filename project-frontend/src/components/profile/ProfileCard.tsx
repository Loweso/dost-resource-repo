import Image from "next/image";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { TiUserDelete } from "react-icons/ti";
import { FiLogOut } from "react-icons/fi";
import EditProfileModal from "./EditProfileModal";
import LogOutModal from "./LogOutModal";
import DeactivateUserModal from "./DeactivateUserModal";

type ProfileCardProps = {
  id: string;
  profileImageUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  yearLevel: number;
  university: string;
  course: string;
  isVerified: boolean;
  showActions?: boolean;
};

export default function ProfileCard({
  id,
  profileImageUrl,
  firstName,
  middleName,
  lastName,
  email,
  yearLevel,
  university,
  course,
  isVerified,
  showActions,
}: ProfileCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [isDeactivateUserModalOpen, setIsDeactivateUserModalOpen] =
    useState(false);

  return (
    <div className="max-w-3xl w-full mx-auto bg-white shadow-md rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center sm:items-start">
      {isEditModalOpen && (
        <EditProfileModal
          id={id}
          profileImageUrl={profileImageUrl}
          firstName={firstName}
          middleName={middleName}
          lastName={lastName}
          email={email}
          yearLevel={yearLevel}
          university={university}
          course={course}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isLogOutModalOpen && (
        <LogOutModal onCancel={() => setIsLogOutModalOpen(false)} />
      )}

      {isDeactivateUserModalOpen && (
        <DeactivateUserModal
          onCancel={() => setIsDeactivateUserModalOpen(false)}
        />
      )}

      {/* Left: Profile Picture */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/3 h-full p-3 md:p-6">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-blue-500 mb-3">
          <Image
            src={profileImageUrl || "/images/default_avatar.png"}
            alt="Profile Picture"
            width={144}
            height={144}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          {isVerified ? (
            <>
              <FaCheckCircle className="text-green-600 text-lg" />
              <span className="text-green-700 font-medium text-sm">
                Verified User
              </span>
            </>
          ) : (
            <>
              <ImCross className="text-red-600 text-base" />
              <span className="text-red-700 font-medium text-sm">
                Unverified User
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: User Info + Buttons */}
      <div className="text-left w-full space-y-2 p-4 md:p-8 bg-blue-50 text-xs sm:text-base border-t-2 sm:border-t-0 sm:border-l-2">
        <div>
          <span className="font-semibold text-gray-700">First Name: </span>
          <span className="font-creato">{firstName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Middle Name: </span>
          <span className="font-creato">{middleName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Last Name: </span>
          <span className="font-creato">{lastName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email: </span>
          <span className="font-creato">{email}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Year Level: </span>
          <span className="font-creato">{yearLevel}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">University: </span>
          <span className="font-creato">{university}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Course: </span>
          <span className="font-creato">{course}</span>
        </div>

        {showActions && (
          <div className="pt-4 flex flex-row items-center justify-end md:justify-between space-y-2 md:space-y-0 md:space-x-4 gap-2">
            <button
              className="flex items-center gap-2 text-yellow-700 bg-yellow-100 p-2 rounded-xl hover:underline hover:bg-yellow-200 cursor-pointer"
              onClick={() => setIsEditModalOpen(true)}
            >
              <FiEdit className="text-lg md:text-base" />
              <span className="hidden md:inline font-creato">Edit Profile</span>
            </button>
            <button
              className="flex items-center gap-2 text-red-700 bg-red-100 p-2 rounded-xl hover:underline hover:bg-red-200 cursor-pointer"
              onClick={() => setIsDeactivateUserModalOpen(true)}
            >
              <TiUserDelete className="text-lg md:text-base" />
              <span className="hidden md:inline font-creato">
                Deactivate Profile
              </span>
            </button>
            <button
              className="flex items-center gap-2 text-gray-700 bg-gray-300 p-2 rounded-xl hover:underline hover:bg-gray-400 cursor-pointer"
              onClick={() => setIsLogOutModalOpen(true)}
            >
              <FiLogOut className="text-lg md:text-base" />
              <span className="hidden md:inline font-creato">Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
