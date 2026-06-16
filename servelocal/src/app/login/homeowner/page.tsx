import { redirect } from "next/navigation";

export default function LoginHomeownerRedirect() {
  redirect("/login?as=homeowner");
}
