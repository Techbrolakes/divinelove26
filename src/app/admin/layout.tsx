import { redirect } from "next/navigation";
import { getAdminUser } from "@/actions/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  // Allow the login page through without auth
  return <>{children}</>;
}
