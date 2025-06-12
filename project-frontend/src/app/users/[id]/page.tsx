"use client";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileCard from "@/components/profile/ProfileCard";
import RequirementsTracker from "@/components/profile/RequirementsTracker";
import { LoadingModal } from "@/components/loadingModal";
import { UserStore } from "@/store/user";
import api from "@/lib/api";

type UserProfile = {
  profileImageUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  yearLevel: number;
  university: string;
  course: string;
  isVerified: boolean;
};

export default function ProfilePage() {
  const { id } = useParams();
  const userId = id as string;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { userId: currentUserId, isLoggedIn } = UserStore();
  const showActions = isLoggedIn && currentUserId === userId;

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setUserProfile(response.data);
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Registration error:", axiosError);
        toast.error(
          `Fetching user data failed: ${
            axiosError.message || "Please check your network."
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Toaster />
      {loading && <LoadingModal />}
      <div className="w-full h-screen py-16 px-4 flex flex-col justify-center items-center gap-4 md:gap-9">
        <div className="absolute inset-0 ocean-bg"></div>
        <p className="text-5xl sm:text-7xl text-white font-vogue text-center">
          WELCOME!
        </p>

        {userProfile && (
          <ProfileCard id={userId} {...userProfile} showActions={showActions} />
        )}
      </div>

      <div className="w-full bg-white py-12 px-4 sm:px-8">
        <RequirementsTracker />
      </div>
    </div>
  );
}
