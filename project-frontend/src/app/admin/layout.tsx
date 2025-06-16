import { AdminGuard } from "@/components/adminGuard";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren<object>) {
  return <AdminGuard>{children}</AdminGuard>;
}
