"use client";
import ProfileCard from "@/components/profile/ProfileCard";
import RequirementsTracker from "@/components/profile/RequirementsTracker";

export default function ProfilePage() {
  const userProfile = {
    profileImageUrl: "",
    firstName: "Louise",
    middleName: "M.",
    lastName: "Deiparine",
    email: "louise@example.com",
    yearLevel: "3rd Year",
    university: "University of Cebu",
    course: "BS Computer Science",
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="w-full bg-gray-100 py-16 px-4 flex flex-col justify-center items-center gap-9 ocean-bg">
        <p className="text-5xl sm:text-7xl text-white font-vogue text-center">
          WELCOME!
        </p>
        <ProfileCard {...userProfile} />
      </div>

      <div className="w-full bg-white py-12 px-4 sm:px-8">
        <RequirementsTracker />
      </div>
    </div>
  );
}
