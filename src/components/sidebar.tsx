"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Search,
    Bookmark,
    History,
    Settings,
    LogOut,
    GraduationCap,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Search, label: "Browse Questions", href: "/browse" },
    { icon: Bookmark, label: "Saved", href: "/saved" },
    { icon: History, label: "History", href: "/history" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col p-6 z-50">
            <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm tracking-tight text-foreground">YABATECH PQ</h2>
                        <p className="text-[10px] text-muted-foreground font-medium">Student Portal</p>
                    </div>
                </div>
                <ModeToggle />
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all group",
                            pathname === item.href
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5",
                            pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                        <Sparkles className="w-8 h-8 rotate-12" />
                    </div>
                    <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1">Upgrade Plan</p>
                    <p className="text-foreground text-xs font-medium mb-3">Get unlimited access to all courses</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-[10px] font-bold transition-all">
                        Upgrade Plan
                    </button>
                </div>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-all text-sm font-medium">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
