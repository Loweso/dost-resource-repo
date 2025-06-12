"use client";
import SignUpPage from "@/components/auth/signUpPage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/store/user";

export default function SignupPage() {
  const router = useRouter();
  const { isLoggedIn, userId } = UserStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.push(`/users/${userId}`);
    }
  }, [isLoggedIn, router, userId]);

  return <SignUpPage />;
}
