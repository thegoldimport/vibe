"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stats = [
  {
    title: "Monthly Revenue",
    value: "$12,450",
    description: "+15% from last month",
    icon: TrendingUp,
    trend: "up",
  },
  {
    title: "Active Clients",
    value: "24",
    description: "+2 new this week",
    icon: Users,
    trend: "up",
  },
  {
    title: "New Leads",
    value: "148",
    description: "42 need attention",
    icon: Search,
    trend: "up",
  },
  {
    title: "Completed Tasks",
    value: "89",
    description: "Last 30 days",
    icon: CheckCircle2,
    trend: "neutral",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "audit",
    title: "Audit completed for Sunset Roofing",
    time: "2 hours ago",
    status: "success",
  },
  {
    id: 2,
    type: "lead",
    title: "New lead found: Blue Sky HVAC",
    time: "4 hours ago",
    status: "new",
  },
  {
    id: 3,
    type: "task",
    title: "AI CEO scheduled 12 outreach emails",
    time: "Yesterday",
    status: "pending",
  },
  {
    id: 4,
    type: "client",
    title: "New client signed: Green Lawns SEO",
    time: "2 days ago",
    status: "success",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Welcome back. Your AI team has been busy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Pipeline Chart Placeholder */}
        <Card className="lg:col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pipeline Performance</CardTitle>
            <CardDescription>
              Conversion rate across your sales funnel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-end justify-between gap-2 px-2">
               {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group cursor-pointer hover:bg-primary/30 transition-colors" style={{ height: `${h}%` }}>
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] py-1 px-2 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}%
                     </div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
               <span>Sat</span>
               <span>Sun</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events from your agency.</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'new' ? 'bg-primary animate-pulse' : 
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                     <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs text-muted-foreground hover:text-foreground">
               View all activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Task Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4">
               <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="size-5 text-primary" />
               </div>
               <div>
                  <CardTitle className="text-base">Pending Audits</CardTitle>
                  <CardDescription>4 audits in progress</CardDescription>
               </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">smith-roofing.com</span>
                        <span className="text-primary font-medium">85%</span>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4">
               <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="size-5 text-purple-500" />
               </div>
               <div>
                  <CardTitle className="text-base">Outreach Success</CardTitle>
                  <CardDescription>12% reply rate this week</CardDescription>
               </div>
            </CardHeader>
            <CardContent>
               <div className="h-10 flex items-end gap-1">
                  {[3, 5, 4, 7, 6, 8, 5, 9, 7, 10, 8, 12].map((h, i) => (
                     <div key={i} className="flex-1 bg-purple-500/20 rounded-t-sm" style={{ height: `${h * 8}%` }} />
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="border-border/50 bg-card/50 backdrop-blur-sm border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
               <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="size-5 text-muted-foreground" />
               </div>
               <p className="text-sm font-medium">Add New Widget</p>
               <p className="text-xs text-muted-foreground mt-1">Customize your dashboard</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
