"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Zap className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">VibeAgencies</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
          <Link href="#how-it-works" className="transition-colors hover:text-foreground">How it works</Link>
          <Link href="#pricing" className="transition-colors hover:text-foreground">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log in</Button>
          </Link>
          <Link href="/onboarding">
            <Button size="sm" className="shadow-[0_0_15px_rgba(124,58,237,0.3)]">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
