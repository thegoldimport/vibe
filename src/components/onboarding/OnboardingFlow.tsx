"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  Globe, 
  Users, 
  Bot, 
  Search,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const NICHES = [
  { id: "roofing", name: "Roofing", icon: "🏠", color: "bg-orange-500/10 text-orange-500" },
  { id: "hvac", name: "HVAC", icon: "❄️", color: "bg-blue-500/10 text-blue-500" },
  { id: "dental", name: "Dental", icon: "🦷", color: "bg-cyan-500/10 text-cyan-500" },
  { id: "seo", name: "SEO Agency", icon: "🔍", color: "bg-purple-500/10 text-purple-500" },
  { id: "leadgen", name: "Lead Gen", icon: "🎯", color: "bg-green-500/10 text-green-500" },
  { id: "realestate", name: "Real Estate", icon: "🏢", color: "bg-red-500/10 text-red-500" },
  { id: "law", name: "Law Firms", icon: "⚖️", color: "bg-zinc-500/10 text-zinc-500" },
  { id: "custom", name: "Custom", icon: "✨", color: "bg-primary/10 text-primary" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    niche: "",
    agencyName: "",
    targetAudience: "",
    serviceFocus: "",
    ownerName: "",
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleNicheSelect = (nicheId: string) => {
    setFormData({ ...formData, niche: nicheId });
    nextStep();
  };

  const handleComplete = () => {
    nextStep(); // Move to generating step
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">What kind of agency are you building?</h1>
              <p className="text-muted-foreground">Select a niche to pre-configure your AI team and website.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {NICHES.map((niche) => (
                <Card
                  key={niche.id}
                  className={`p-6 cursor-pointer border-2 transition-all hover:border-primary/50 ${
                    formData.niche === niche.id ? "border-primary bg-primary/5" : "border-white/5 bg-white/5"
                  }`}
                  onClick={() => handleNicheSelect(niche.id)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">{niche.icon}</span>
                    <span className="font-medium">{niche.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Let's name your agency</h1>
              <p className="text-muted-foreground">You can change this later.</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="agencyName">Agency Name</Label>
                <Input
                  id="agencyName"
                  placeholder="e.g. Skyline Digital"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  className="h-12 text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerName">Your Name</Label>
                <Input
                  id="ownerName"
                  placeholder="John Doe"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="ghost" onClick={prevStep} className="flex-1 h-12">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={nextStep} 
                  disabled={!formData.agencyName || !formData.ownerName}
                  className="flex-[2] h-12"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Configure your AI Team</h1>
              <p className="text-muted-foreground">Who will your agency serve?</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g. Local roofers in Texas"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceFocus">Primary Service</Label>
                <Input
                  id="serviceFocus"
                  placeholder="e.g. Facebook Ads & Lead Gen"
                  value={formData.serviceFocus}
                  onChange={(e) => setFormData({ ...formData, serviceFocus: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="ghost" onClick={prevStep} className="flex-1 h-12">
                  Back
                </Button>
                <Button 
                  onClick={handleComplete} 
                  disabled={!formData.targetAudience || !formData.serviceFocus}
                  className="flex-[2] h-12 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                >
                  Generate My Agency
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <GeneratingStep onComplete={nextStep} />
        )}

        {step === 5 && (
          <SuccessStep agencyName={formData.agencyName} />
        )}
      </AnimatePresence>
    </div>
  );
}

function GeneratingStep({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing generator...");

  const steps = [
    { threshold: 10, label: "Initializing generator..." },
    { threshold: 25, label: "Generating brand identity..." },
    { threshold: 45, label: "Building landing page..." },
    { threshold: 65, label: "Assembling AI Team..." },
    { threshold: 85, label: "Setting up Lead Gen engine..." },
    { threshold: 100, label: "Finalizing agency..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        
        const currentStep = steps.find(s => next <= s.threshold) || steps[steps.length - 1];
        setStatus(currentStep.label);
        
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="generating"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="relative inline-block mb-12">
        <div className="h-32 w-32 rounded-full border-4 border-primary/20 flex items-center justify-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Building your agency...</h2>
      <p className="text-muted-foreground text-lg mb-8 h-8">{status}</p>
      
      <div className="max-w-md mx-auto h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto opacity-50">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className={`h-4 w-4 ${progress > 25 ? "text-green-500" : ""}`} />
          <span>Branding</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className={`h-4 w-4 ${progress > 45 ? "text-green-500" : ""}`} />
          <span>Website</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className={`h-4 w-4 ${progress > 65 ? "text-green-500" : ""}`} />
          <span>AI Employees</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className={`h-4 w-4 ${progress > 85 ? "text-green-500" : ""}`} />
          <span>Lead Gen</span>
        </div>
      </div>
    </motion.div>
  );
}

function SuccessStep({ agencyName }: { agencyName: string }) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 border-2 border-green-500/50">
        <Check className="h-12 w-12 text-green-500" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Your Agency is Live!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Congratulations, <span className="text-foreground font-semibold">{agencyName}</span> is ready for business.
      </p>
      
      <Card className="max-w-md mx-auto p-8 border-white/10 bg-white/5 backdrop-blur-sm mb-12">
        <h3 className="font-bold text-left mb-6 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary fill-current" />
          Next Steps
        </h3>
        <ul className="space-y-4 text-left">
          <li className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">1</div>
            <p className="text-sm">Meet your AI CEO in the dashboard</p>
          </li>
          <li className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">2</div>
            <p className="text-sm">Run your first AI website audit for a prospect</p>
          </li>
          <li className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">3</div>
            <p className="text-sm">Review the generated website content</p>
          </li>
        </ul>
      </Card>

      <Button size="lg" className="h-14 px-12 text-lg font-bold shadow-[0_0_30px_rgba(124,58,237,0.5)]" onClick={() => window.location.href = "/dashboard"}>
        Go to Dashboard
      </Button>
    </motion.div>
  );
}
