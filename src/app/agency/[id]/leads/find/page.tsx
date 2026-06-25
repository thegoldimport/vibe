"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const mockResults = [
  {
    id: "r1",
    name: "Superior Roofing & Exteriors",
    address: "123 Business Way, Austin, TX",
    website: "superiorroofing.com",
    rating: 4.2,
    reviews: 48,
  },
  {
    id: "r2",
    name: "Lone Star Roof Repair",
    address: "456 Skyline Dr, Austin, TX",
    website: "lonestarroofs.net",
    rating: 3.8,
    reviews: 24,
  },
  {
    id: "r3",
    name: "Austin Residential Roofing",
    address: "789 Hill Country Ln, Austin, TX",
    website: "austinresroofing.com",
    rating: 4.5,
    reviews: 156,
  },
];

export default function FindLeadsPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [addedLeads, setAddedLeads] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setHasResults(true);
    }, 2000);
  };

  const addLead = (id: string) => {
    setAddedLeads((prev) => [...prev, id]);
    toast.success("Lead added to your dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Find Leads</h2>
        <p className="text-muted-foreground text-lg">
          Discover high-intent businesses in any niche and location.
        </p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-primary/5 pb-8">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI Prospector
          </CardTitle>
          <CardDescription>
            Enter a niche and location to find businesses that need your services.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-[-20px]">
          <form onSubmit={handleSearch} className="grid gap-6 md:grid-cols-7 items-end bg-background p-6 rounded-xl border border-border/50 shadow-2xl">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input id="niche" placeholder="e.g. Roofing, HVAC, Dental" className="pl-10" required defaultValue="Roofing" />
              </div>
            </div>
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input id="location" placeholder="e.g. Austin, TX" className="pl-10" required defaultValue="Austin, TX" />
              </div>
            </div>
            <div className="md:col-span-1">
              <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90" disabled={isSearching}>
                {isSearching ? <Loader2 className="size-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isSearching && (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <div className="relative size-20">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                 <Search className="size-6 text-primary" />
              </div>
           </div>
           <div className="text-center">
              <p className="font-medium">Searching Google Maps & Directories...</p>
              <p className="text-sm text-muted-foreground">Scraping data for businesses in Austin, TX</p>
           </div>
        </div>
      )}

      {hasResults && !isSearching && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-2">
            <p className="text-sm font-medium">{mockResults.length} leads found</p>
            <Button variant="ghost" size="sm" className="text-xs">
              Sort by Rating
            </Button>
          </div>
          <div className="grid gap-4">
            {mockResults.map((result) => (
              <Card key={result.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="size-12 rounded-lg bg-muted flex items-center justify-center font-bold text-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {result.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{result.name}</h3>
                        <Badge variant="secondary" className="text-[10px] h-4">
                           {result.rating} ★
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" />
                        {result.address}
                      </p>
                      <p className="text-xs text-primary underline">
                        {result.website}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className={addedLeads.includes(result.id) ? "bg-green-500 hover:bg-green-600" : ""}
                      onClick={() => addLead(result.id)}
                      disabled={addedLeads.includes(result.id)}
                    >
                      {addedLeads.includes(result.id) ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Lead
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="pt-4 flex justify-center">
            <Button variant="outline" className="gap-2">
              Load More Results
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
