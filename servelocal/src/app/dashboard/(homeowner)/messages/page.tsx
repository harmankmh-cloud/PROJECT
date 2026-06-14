import { MessagesInbox } from "@/components/messages/MessagesInbox";

export default function MessagesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Messages</h1>
      <p className="mt-1 text-sm text-muted">Chat with pros about your jobs.</p>
      <div className="mt-8">
        <MessagesInbox />
      </div>
    </div>
  );
}
