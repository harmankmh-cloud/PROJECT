import { redirect } from "next/navigation";

export default function AdminShareRedirect() {
  redirect("/dashboard/share");
}
