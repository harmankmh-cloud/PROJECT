import { redirect } from "next/navigation";

/** Legacy URL — one login for all account types. */
export default function LoginProRedirect() {
  redirect("/login");
}
