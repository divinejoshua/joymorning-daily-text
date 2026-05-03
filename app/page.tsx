import { SignupForm } from "@/app/components/signup-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_420px]">
        <div className="max-w-2xl space-y-7">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-normal text-primary">
              Joymorning Daily Text
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
              Wake up to one Bible passage, every morning.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Simple daily scripture by text message, delivered around 7am in
              your country.
            </p>
          </div>

          <figure className="max-w-xl rounded-lg border bg-muted p-5 text-muted-foreground shadow-sm">
            <blockquote className="text-lg leading-8 text-foreground">
              Hello there, &ldquo;Do not let your heart be troubled. Believe in
              God; believe also in me.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm font-medium text-primary">
              John 14:1
            </figcaption>
          </figure>
        </div>

        <div className="space-y-4">
          <SignupForm />
          <p className="text-sm leading-6 text-muted-foreground">
            We only need your country so your morning text arrives at the right
            local time.
          </p>
        </div>
      </section>
    </main>
  );
}
