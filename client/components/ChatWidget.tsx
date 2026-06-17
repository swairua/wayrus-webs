import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

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
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/25 px-5 py-3 font-semibold flex items-center gap-2 z-50"
      >
        {open ? (
          <>
            <X className="w-4 h-4" /> Close
          </>
        ) : (
          <>
            <MessageCircle className="w-4 h-4" /> Chat with us
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 rounded-2xl border bg-white/90 backdrop-blur-lg p-5 shadow-2xl dark:bg-background/90 z-50"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-full bg-gradient-to-br from-primary to-secondary p-2">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">AI Assistant</h4>
                <p className="text-xs text-muted-foreground">
                  Tell us about your project
                </p>
              </div>
            </div>
            <form onSubmit={send} className="space-y-3">
              <input
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                placeholder="Message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2.5 font-semibold text-primary-foreground flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </motion.button>
              {sent && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 text-center"
                >
                  Thanks, we'll be in touch!
                </motion.p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
