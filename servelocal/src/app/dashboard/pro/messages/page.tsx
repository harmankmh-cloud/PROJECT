import { MessagesInbox } from "@/components/messages/MessagesInbox";

export default function ProMessagesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Messages</h1>
      <p className="mt-1 text-sm text-muted">Conversations with homeowners.</p>
      <div className="mt-8">
        <MessagesInbox asPro />
      </div>
    </div>
  );
}
