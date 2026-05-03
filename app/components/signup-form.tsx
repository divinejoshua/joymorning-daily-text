"use client";

import { FormEvent, useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

type Status =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function SignupForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("GB");
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountry = useMemo(
    () => COUNTRIES.find((country) => country.code === countryCode),
    [countryCode],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, countryCode }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not save your signup.");
      }

      setStatus({
        type: "success",
        message:
          result.message ??
          "You're set. Your daily text will arrive at 7am.",
      });
      setPhoneNumber("");
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not save your signup.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-5"
    >
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Country</span>
          <select
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.callingCode})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Phone number</span>
          <div className="mt-2 flex rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
            <span className="flex h-11 items-center border-r px-3 text-sm text-muted-foreground">
              {selectedCountry?.callingCode}
            </span>
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              inputMode="tel"
              autoComplete="tel"
              placeholder="7123 456789"
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              required
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Send my daily text"}
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
