"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Search,
    Bookmark,
    History,
    Settings,
    LogOut,
    GraduationCap,
    Sparkles,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSidebar } from "@/context/sidebar-context";
import { auth } from "@/lib/supabase";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Search, label: "Browse Questions", href: "/browse" },
    { icon: Bookmark, label: "Saved", href: "/saved" },
    { icon: History, label: "History", href: "/history" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isCollapsed, toggleSidebar } = useSidebar();

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-50 overflow-hidden",
                isCollapsed ? "w-20 p-4" : "w-64 p-6"
            )}
        >
            {/* Header Section */}
            <div className={cn(
                "flex items-center mb-10",
                isCollapsed ? "justify-center" : "justify-between px-2"
            )}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 shrink-0">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="transition-opacity duration-300">
                            <h2 className="font-bold text-lg tracking-tight text-blue-600">Yabatech</h2>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Archive</p>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                )}

                <button
                    onClick={toggleSidebar}
                    className={cn(
                        "p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground",
                        isCollapsed && "mt-4"
                    )}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center rounded-2xl text-sm font-medium transition-all group relative",
                            isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                            pathname === item.href
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        title={isCollapsed ? item.label : ""}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 shrink-0",
                            pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {!isCollapsed && <span>{item.label}</span>}
                        {isCollapsed && pathname === item.href && (
                            <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto pt-6 space-y-4">
                {!isCollapsed && (
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                            <Sparkles className="w-8 h-8 rotate-12" />
                        </div>
                        <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1">Upgrade Plan</p>
                        <p className="text-foreground text-xs font-medium mb-3">Get unlimited access</p>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-[10px] font-bold transition-all">
                            Upgrade
                        </button>
                    </div>
                )}

                {/* New Theme Toggle Position */}
                <div className={cn(
                    "flex items-center",
                    isCollapsed ? "justify-center" : "justify-between px-2 bg-muted/30 p-2 rounded-2xl border border-border/50"
                )}>
                    {!isCollapsed && <span className="text-xs font-medium text-muted-foreground">Appearance</span>}
                    <ThemeToggle className={isCollapsed ? "scale-75" : "scale-90"} />
                </div>

                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all text-sm font-medium rounded-2xl",
                        isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                    )}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
