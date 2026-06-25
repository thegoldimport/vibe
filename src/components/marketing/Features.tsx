"use client";

import { motion } from "framer-motion";
import { 
  Globe, 
  Search, 
  Users, 
  Zap, 
  Shield, 
  BarChart3,
  Bot,
  Megaphone
} from "lucide-react";

const features = [
  {
    title: "Instant Website Generation",
    description: "Launch a high-converting, branded landing page for your agency niche in seconds.",
    icon: Globe,
  },
  {
    title: "AI CEO & Employee Team",
    description: "Your agency comes with a full team of specialized AI employees managed by an AI CEO.",
    icon: Bot,
  },
  {
    title: "Built-in Lead Generation",
    description: "Automatically find and enrich local businesses that need your services.",
    icon: Search,
  },
  {
    title: "Automated AI Audits",
    description: "Win clients with personalized AI audits for their website, SEO, and visibility.",
    icon: BarChart3,
  },
  {
    title: "White-labeled Dashboard",
    description: "Professional client portal where your customers can see progress and communicate.",
    icon: Shield,
  },
  {
    title: "Automated Fulfillment",
    description: "The AI CEO delegates tasks to employees and manages delivery without you lifting a finger.",
    icon: Zap,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to scale</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            VibeAgencies provides the complete operational stack for a modern digital agency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:border-primary/50 group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
