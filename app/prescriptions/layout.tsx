import AuthGuard from "@/components/auth/auth-guard";

export default function PrescriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role="doctor">{children}</AuthGuard>;
}
