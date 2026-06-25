"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  FileSearch,
  Mail,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuditDialog } from "@/components/dashboard/AuditDialog";

const leads = [
  {
    id: "1",
    businessName: "Sunset Roofing & Siding",
    contact: "John Miller",
    email: "john@sunsetroofing.com",
    status: "new",
    auditScore: null,
    niche: "Roofing",
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    businessName: "Elite HVAC Solutions",
    contact: "Sarah Chen",
    email: "sarah@elitehvac.com",
    status: "audited",
    auditScore: 78,
    niche: "HVAC",
    lastActivity: "Yesterday",
  },
  {
    id: "3",
    businessName: "Green Lawns Landscaping",
    contact: "Mike Ross",
    email: "mike@greenlawns.com",
    status: "contacted",
    auditScore: 92,
    niche: "Landscaping",
    lastActivity: "3 days ago",
  },
  {
    id: "4",
    businessName: "Oakwood Tree Service",
    contact: "Robert Oak",
    email: "robert@oakwood.com",
    status: "new",
    auditScore: null,
    niche: "Tree Service",
    lastActivity: "4 days ago",
  },
  {
    id: "5",
    businessName: "Precision Dental Care",
    contact: "Dr. Amy Lee",
    email: "amy@precisiondental.com",
    status: "converted",
    auditScore: 85,
    niche: "Dental",
    lastActivity: "1 week ago",
  },
];

const statusStyles = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  audited: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  contacted: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  converted: "bg-green-500/10 text-green-500 border-green-500/20",
};

export default function LeadsPage() {
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const openAudit = (businessName: string) => {
    setSelectedLead(businessName);
    setIsAuditOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            Manage and track your potential clients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-9 bg-background/50 border-border/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[250px]">Business Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audit Score</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="group border-border/40 hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{lead.businessName}</span>
                      <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider mt-0.5">{lead.niche}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span>{lead.contact}</span>
                      <span className="text-muted-foreground">{lead.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[lead.status as keyof typeof statusStyles]}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.auditScore ? (
                      <div 
                        className="flex items-center gap-2 cursor-pointer group/score"
                        onClick={() => openAudit(lead.businessName)}
                      >
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all group-hover/score:opacity-80 ${
                              lead.auditScore >= 90 ? 'bg-green-500' :
                              lead.auditScore >= 70 ? 'bg-primary' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${lead.auditScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium group-hover/score:text-primary transition-colors">{lead.auditScore}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Not audited</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {lead.lastActivity}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openAudit(lead.businessName)}>
                          <FileSearch className="mr-2 h-4 w-4" />
                          {lead.auditScore ? 'View Audit' : 'Run AI Audit'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Outreach
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Lead</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
         <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <Users className="size-5" />
            </div>
            <div>
               <p className="text-sm font-medium">Total Leads</p>
               <p className="text-2xl font-bold">1,284</p>
            </div>
         </Card>
         <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
               <FileSearch className="size-5" />
            </div>
            <div>
               <p className="text-sm font-medium">Audits Run</p>
               <p className="text-2xl font-bold">452</p>
            </div>
         </Card>
         <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
               <ArrowUpRight className="size-5" />
            </div>
            <div>
               <p className="text-sm font-medium">Conversion Rate</p>
               <p className="text-2xl font-bold">4.2%</p>
            </div>
         </Card>
      </div>

      <AuditDialog 
        open={isAuditOpen} 
        onOpenChange={setIsAuditOpen} 
        businessName={selectedLead || ""} 
      />
    </div>
  );
}
