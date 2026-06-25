import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-20 flex items-center justify-between px-8 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Zap className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">VibeAgencies</span>
        </Link>
        <div className="text-sm text-muted-foreground font-medium">
          Step 1 of 3: Agency Setup
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <OnboardingFlow />
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VibeAgencies. Need help? <Link href="/support" className="underline underline-offset-4">Contact us</Link>
      </footer>
    </div>
  );
}
