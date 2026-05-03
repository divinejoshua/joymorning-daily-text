import Link from "next/link";
import { TestMessageForm } from "@/app/components/test-message-form";
import { DAILY_PASSAGE } from "@/lib/daily-message";

export default function TestSmsPage() {
  return (
    <main className="flex min-h-screen flex-1 bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-3xl flex-col justify-center gap-8">
        <div className="space-y-4">
          <Link
            href="/"
            className="text-sm font-medium text-primary transition hover:opacity-80"
          >
            Back to signup
          </Link>
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-normal text-primary">
              Twilio Test
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Send one passage now.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Enter a full international phone number and send today&apos;s
              sample passage through Twilio.
            </p>
          </div>
        </div>

        <figure className="rounded-lg border bg-muted p-5 shadow-sm">
          <blockquote className="text-lg leading-8">
            {DAILY_PASSAGE.greeting}, &ldquo;{DAILY_PASSAGE.text}&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-sm font-medium text-primary">
            {DAILY_PASSAGE.reference}
          </figcaption>
        </figure>

        <TestMessageForm />
      </section>
    </main>
  );
}
