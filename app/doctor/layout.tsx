import AuthGuard from "@/components/auth/auth-guard";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role="doctor">{children}</AuthGuard>;
}
