import { AppSidebar } from "@/components/dashboard/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/50 backdrop-blur-md px-4 sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
             <h1 className="text-sm font-medium">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="size-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                      AI
                   </div>
                ))}
             </div>
             <Separator orientation="vertical" className="h-4" />
             <button className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                New Task
             </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
           {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
