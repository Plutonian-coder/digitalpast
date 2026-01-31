"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider, useSidebar } from "@/context/sidebar-context";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className={cn(
                "flex-1 p-8 transition-all duration-300",
                isCollapsed ? "ml-20" : "ml-64"
            )}>
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </SidebarProvider>
    );
}
