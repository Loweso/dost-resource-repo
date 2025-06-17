import { AdminGuard } from "@/components/admin/adminGuard";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren<object>) {
  return <AdminGuard>{children}</AdminGuard>;
}
