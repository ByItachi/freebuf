import { isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin — crowl" };

/**
 * /admin shell. Renders the login card until a valid admin session cookie is
 * present; the panel itself is a client component that polls/writes through
 * the guarded /api/admin/* routes.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
        <LoginForm />
      </div>
    );
  }
  return <>{children}</>;
}
