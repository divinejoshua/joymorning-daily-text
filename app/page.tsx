export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10">
        <div className="max-w-2xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-normal text-primary">
            Joymorning Daily Text
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            A calm foundation for reflective daily messages.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            The project now starts from shared design tokens for color,
            typography, radius, shadows, and dark mode.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Background", "bg-background text-foreground"],
            ["Primary", "bg-primary text-primary-foreground"],
            ["Muted", "bg-muted text-muted-foreground"],
          ].map(([label, classes]) => (
            <div
              key={label}
              className={`rounded-lg border p-5 shadow-sm ${classes}`}
            >
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-8 text-xs opacity-80">Design token preview</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
