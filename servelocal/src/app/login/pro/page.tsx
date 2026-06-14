import { redirect } from "next/navigation";

export default function LoginProRedirect() {
  redirect("/login?as=pro");
}
