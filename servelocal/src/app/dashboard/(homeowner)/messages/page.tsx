import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-slate-900">Messages</h1>
      <p className="mt-1 text-sm text-slate-500">Chat with pros about your jobs.</p>
      <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <MessageSquare className="h-12 w-12 text-slate-300" />
        <p className="mt-4 font-medium text-slate-600">No conversations yet</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          When you contact a pro or receive a response, threads will appear here.
        </p>
      </div>
    </div>
  );
}
