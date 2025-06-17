import { StudentAdminGuard } from "@/components/admin/StudentAdminGuard";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren<object>) {
  return <StudentAdminGuard>{children}</StudentAdminGuard>;
}
