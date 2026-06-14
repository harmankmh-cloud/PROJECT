import Link from "next/link";

export function EmergencyBanner() {
  return (
    <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950">
      <span className="font-semibold">Need help NOW?</span>{" "}
      Post an urgent job or{" "}
      <Link href="/search?emergency=1" className="font-semibold text-teal-700 underline">
        browse 24/7 emergency pros
      </Link>
      {" · "}
      <Link href="/request" className="font-semibold text-teal-700 underline">
        Post ASAP job
      </Link>
    </div>
  );
}
