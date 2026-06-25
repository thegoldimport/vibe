"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground fill-current" />
        </div>
        <span className="text-2xl font-bold tracking-tight">VibeAgencies</span>
      </Link>

      <Card className="w-full max-w-md p-8 border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your agency dashboard</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="bg-white/5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="bg-white/5" />
          </div>
          <Button className="w-full h-12 text-lg font-semibold mt-4">
            Sign In
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/onboarding" className="text-primary hover:underline font-medium">
            Get Started
          </Link>
        </div>
      </Card>
    </div>
  );
}
