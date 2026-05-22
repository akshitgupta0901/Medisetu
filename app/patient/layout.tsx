import AuthGuard from "@/components/auth/auth-guard";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role="patient">{children}</AuthGuard>;
}
