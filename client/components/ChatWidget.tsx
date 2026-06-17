import { FormEvent, useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function send(e: FormEvent) {
    e.preventDefault();
    try {
      await apiClient.post("/chat", { name, email, message });
      setSent(true);
      setMessage("");
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error("Chat error:", error);
    }
  }

  return (
    <div>
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 rounded-full bg-primary text-primary-foreground shadow-lg px-5 py-3 font-semibold"
      >
        {open ? "Close" : "Chat with us"}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 w-80 rounded-xl border bg-white p-4 shadow-2xl dark:bg-background">
          <h4 className="font-bold text-primary">AI Assistant</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Tell us about your project. We'll follow up quickly.
          </p>
          <form onSubmit={send} className="space-y-2">
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              className="w-full rounded-md border px-3 py-2"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="w-full rounded-md bg-secondary px-3 py-2 font-semibold text-secondary-foreground">
              Send
            </button>
            {sent && (
              <p className="text-xs text-green-600">
                Thanks, we'll be in touch!
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
