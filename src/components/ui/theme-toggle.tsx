"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className={cn("w-16 h-8 p-1 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 opacity-50", className)} />
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <div
            className={cn(
                "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
                isDark
                    ? "bg-zinc-950 border border-zinc-800"
                    : "bg-white border border-zinc-200",
                className
            )}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    setTheme(isDark ? "light" : "dark")
                }
            }}
        >
            <div className="flex justify-between items-center w-full">
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                        isDark
                            ? "transform translate-x-0 bg-zinc-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                            : "transform translate-x-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    )}
                >
                    {isDark ? (
                        <Moon
                            className="w-3.5 h-3.5 text-blue-400"
                            strokeWidth={2.5}
                        />
                    ) : (
                        <Sun
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={2.5}
                        />
                    )}
                </div>
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                        isDark
                            ? "opacity-100"
                            : "opacity-0 transform -translate-x-8"
                    )}
                >
                    {isDark ? (
                        <Sun
                            className="w-3.5 h-3.5 text-zinc-600"
                            strokeWidth={2}
                        />
                    ) : (
                        <Moon
                            className="w-3.5 h-3.5 text-zinc-400"
                            strokeWidth={2}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
