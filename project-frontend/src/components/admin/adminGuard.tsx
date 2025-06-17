"use client";

import { UserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PropsWithChildren } from "react";

export function AdminGuard({ children }: PropsWithChildren) {
  const role = UserStore((state) => state.role);
  const router = useRouter();

  useEffect(() => {
    if (role && role !== "Admin") {
      router.push("/");
    }
  }, [role, router]);

  if (role !== "Admin") {
    return null;
  }
  return <>{children}</>;
}
