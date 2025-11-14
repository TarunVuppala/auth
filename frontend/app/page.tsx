import Link from "next/link";
import { LayoutDashboard, Rocket, ShieldCheck, Zap } from "lucide-react";

import { SpotlightCard } from "@/components/aceternity/spotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure roles",
    description: "JWT auth, salted passwords, and guarded routes.",
  },
  {
    icon: LayoutDashboard,
    title: "Role-aware dashboards",
    description: "CRUD, search, pagination, and admin tools in one place.",
  },
  {
    icon: Zap,
    title: "Clean UI",
    description: "Shadcn/ui building blocks with light motion and feedback.",
  },
  {
    icon: Rocket,
    title: "Ready to ship",
    description: "Next.js + Express + MongoDB setup that deploys anywhere.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center">
      <section className="flex-1 space-y-6">
        <Badge variant="secondary" className="px-4 py-2">
          Auth + dashboard kit
        </Badge>
        <h1 className="text-4xl font-semibold leading-tight text-[color:var(--foreground)] md:text-5xl">
          Build a role-based dashboard without the guesswork.
        </h1>
        <p className="text-lg text-[color:var(--muted-foreground)]">
          This starter pairs JWT auth, protected pages, CRUD items, and a small admin area using
          Next.js, Express, MongoDB, and axios.
        </p>
        <div className="flex flex-col gap-4 text-sm font-semibold sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/signup">Create account</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-dashed px-8"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </section>
      <section className="flex-1">
        <SpotlightCard className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--card)]/80 p-10 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--muted-foreground)]">
            What you get
          </p>
          <div className="mt-6 space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-3xl border border-transparent px-4 py-3 transition hover:border-[color:var(--border)]"
              >
                <div className="rounded-2xl bg-[color:var(--accent)] p-3 text-[color:var(--accent-foreground)]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[color:var(--foreground)]">{title}</p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </section>
    </main>
  );
}
