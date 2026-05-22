import AuthGuard from "@/components/auth/auth-guard";

export default function TelehealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role="doctor">{children}</AuthGuard>;
}
