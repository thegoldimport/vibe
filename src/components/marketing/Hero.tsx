"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.15)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8"
          >
            <Sparkles className="h-4 w-4 fill-current" />
            <span>Launch your agency today</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-linear-to-b from-white to-white/50"
          >
            Launch an AI-Powered Agency in 30 Minutes
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            No code. No hiring. Pick a niche, and the platform instantly generates a branded website, AI employees, and automated lead generation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/onboarding">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-[0_0_25px_rgba(124,58,237,0.4)] group">
                Build My Agency
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all">
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10 blur-3xl" />
          <div className="rounded-xl overflow-hidden border border-white/10 bg-zinc-900 aspect-video flex items-center justify-center text-zinc-500">
            {/* Mock Dashboard UI */}
            <div className="w-full h-full p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="h-8 w-32 bg-zinc-800 rounded-md animate-pulse" />
                  <div className="h-8 w-24 bg-zinc-800 rounded-md animate-pulse" />
                </div>
                <div className="h-8 w-8 bg-zinc-800 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="h-40 bg-zinc-800/50 rounded-xl border border-white/5 flex flex-col p-4 gap-2">
                  <div className="h-4 w-1/2 bg-zinc-700 rounded" />
                  <div className="h-8 w-3/4 bg-zinc-600 rounded mt-2" />
                </div>
                <div className="h-40 bg-zinc-800/50 rounded-xl border border-white/5 flex flex-col p-4 gap-2">
                  <div className="h-4 w-1/2 bg-zinc-700 rounded" />
                  <div className="h-8 w-3/4 bg-zinc-600 rounded mt-2" />
                </div>
                <div className="h-40 bg-zinc-800/50 rounded-xl border border-white/5 flex flex-col p-4 gap-2">
                  <div className="h-4 w-1/2 bg-zinc-700 rounded" />
                  <div className="h-8 w-3/4 bg-zinc-600 rounded mt-2" />
                </div>
              </div>
              <div className="flex-1 bg-zinc-800/50 rounded-xl border border-white/5 p-4">
                <div className="h-4 w-1/4 bg-zinc-700 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-2 bg-zinc-700 rounded w-full" />
                  <div className="h-2 bg-zinc-700 rounded w-5/6" />
                  <div className="h-2 bg-zinc-700 rounded w-4/6" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
