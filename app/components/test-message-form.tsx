"use client";

import { FormEvent, useState } from "react";

type Status =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function TestMessageForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/test-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not send the test passage.");
      }

      setStatus({
        type: "success",
        message: result.message ?? "Test passage sent.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not send the test passage.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-5"
    >
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Phone number</span>
          <input
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="+447123456789"
            className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSending}
          className="h-11 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send test passage"}
        </button>

        {status.type !== "idle" ? (
          <p
            className={`rounded-md border px-3 py-2 text-sm ${
              status.type === "success"
                ? "border-primary/30 bg-primary/10 text-foreground"
                : "border-destructive/30 bg-destructive/10 text-foreground"
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
