"use client";

import LoginPageComponent from "@/components/auth/loginPage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/store/user";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, userId } = UserStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.push(`/users/${userId}`);
    }
  }, [isLoggedIn, router, userId]);

  return <LoginPageComponent />;
}
