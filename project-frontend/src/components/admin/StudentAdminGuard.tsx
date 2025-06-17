"use client";

import { UserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PropsWithChildren } from "react";

export function StudentAdminGuard({ children }: PropsWithChildren) {
  const role = UserStore((state) => state.role);
  const router = useRouter();

  useEffect(() => {
    if (role && role !== "Admin" && role !== "StudentAdmin") {
      router.push("/");
    }
  }, [role, router]);

  if (role !== "Admin" && role !== "StudentAdmin") {
    return null;
  }
  return <>{children}</>;
}
