"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Info, ArrowRight, Zap, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessName: string;
}

export function AuditDialog({ open, onOpenChange, businessName }: AuditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card p-0 border-border/50">
        <div className="bg-gradient-to-br from-primary/20 via-purple-500/10 to-background p-8 border-b border-border/50">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">AI Audit Complete</Badge>
              <DialogTitle className="text-3xl font-bold">{businessName}</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Generated on June 25, 2026 • 2:45 PM
              </DialogDescription>
            </div>
            <div className="flex flex-col items-end">
              <div className="size-24 rounded-full border-4 border-primary/30 flex items-center justify-center relative">
                <svg className="size-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={226}
                    strokeDashoffset={226 - (226 * 78) / 100}
                    className="text-primary"
                  />
                </svg>
                <span className="absolute text-2xl font-bold">78</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold mt-2 text-muted-foreground">Overall Score</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
             {[
                { label: "SEO", score: 82, color: "bg-green-500" },
                { label: "Performance", score: 64, color: "bg-yellow-500" },
                { label: "Conversion", score: 91, color: "bg-green-500" },
                { label: "Accessibility", score: 75, color: "bg-primary" },
             ].map((item) => (
                <div key={item.label} className="bg-background/40 backdrop-blur-md rounded-xl p-3 border border-border/50">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{item.label}</p>
                   <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{item.score}</span>
                      <div className={`h-1.5 w-12 rounded-full bg-muted overflow-hidden`}>
                         <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Wins */}
          <section>
            <div className="flex items-center gap-2 mb-4">
               <Zap className="size-5 text-yellow-500 fill-yellow-500/20" />
               <h3 className="text-lg font-bold">Top Quick Wins</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
               {[
                  "Optimize meta descriptions for 12 local service pages",
                  "Enable image compression to save 2.4s on mobile load",
                  "Add Schema.xml markup for local business visibility",
                  "Fix 4 broken links on the 'Our Work' gallery page"
               ].map((win, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-border/50 bg-muted/30">
                     <div className="size-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="size-3" />
                     </div>
                     <span className="text-sm font-medium">{win}</span>
                  </div>
               ))}
            </div>
          </section>

          {/* Critical Findings */}
          <section>
            <div className="flex items-center gap-2 mb-4">
               <AlertTriangle className="size-5 text-destructive" />
               <h3 className="text-lg font-bold">Critical Findings</h3>
            </div>
            <div className="space-y-4">
               {[
                  {
                     title: "Slow Server Response Time",
                     desc: "The server is taking 1.2s to respond. This is causing a 40% bounce rate on mobile devices.",
                     impact: "High Impact"
                  },
                  {
                     title: "Missing Google Maps Integration",
                     desc: "The website lacks an embedded map and correct NAP consistency, hurting local rankings.",
                     impact: "Medium Impact"
                  }
               ].map((finding, i) => (
                  <div key={i} className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex justify-between items-start">
                     <div>
                        <h4 className="font-bold text-destructive flex items-center gap-2">
                           {finding.title}
                           <Badge variant="outline" className="text-[10px] h-4 border-destructive/30 text-destructive">{finding.impact}</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{finding.desc}</p>
                     </div>
                     <Button variant="ghost" size="sm" className="text-xs hover:bg-destructive/10 hover:text-destructive">
                        Fix Now
                     </Button>
                  </div>
               ))}
            </div>
          </section>

          {/* ROI Opportunity */}
          <section className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
             <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="size-5 text-primary" />
                      <h3 className="text-xl font-bold">ROI Opportunity</h3>
                   </div>
                   <p className="text-muted-foreground">
                      By fixing these issues, we estimate an increase of <span className="text-foreground font-bold">12-15 new leads per month</span>, with an estimated monthly revenue increase of <span className="text-foreground font-bold">$3,500 - $5,000</span>.
                   </p>
                </div>
                <div className="shrink-0">
                   <Button className="bg-primary hover:bg-primary/90 gap-2">
                      Send This Report
                      <ArrowRight className="size-4" />
                   </Button>
                </div>
             </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
