"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { GradientWave } from "@/components/ui/gradient-wave";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection01() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = mounted ? resolvedTheme : "dark";

    // Colors adapted for dark mode (from page.tsx) vs light mode (provided default)
    const gradientColors = currentTheme === "dark"
        ? ["#000000", "#1e3a8a", "#1e40af", "#1e3a8a", "#000000"]
        : ["#ffffff", "#fb7185", '#e879f9', "#a3e635", "#ffffff"];

    return (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
            {/* GradientWave behind the text */}
            <GradientWave
                colors={gradientColors}
                shadowPower={currentTheme === "dark" ? 8 : 4}
                darkenTop={currentTheme === "dark"}
                noiseFrequency={[0.0001, 0.0002]}
                deform={{ incline: 0.2, noiseAmp: 100, noiseFlow: 2 }}
            />
            <div className="flex flex-col text-center">
                <img
                    src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/brand/ai-logo.png"
                    alt="Your Image"
                    height={50}
                    width={50}
                    className="h-30 z-40 w-full object-contain"
                />
                <h2 className={cn(
                    "font-extrabold pt-10 tracking-tighter text-7xl md:text-7xl lg:text-9xl transition-all duration-300",
                    currentTheme === "dark" ? "text-white mix-blend-plus-lighter" : "text-black mix-blend-overlay"
                )}>
                    Design <br /> without Limits
                </h2>
                <div className="space-y-6 z-10 pt-20 flex justify-center items-center flex-col text-center px-6">
                    <p className={cn(
                        "w-full max-w-lg font-light text-sm md:text-xl transition-colors duration-300",
                        currentTheme === "dark" ? "text-gray-300" : "text-black"
                    )}>
                        I create digital experiences that connect and inspire. I build apps,
                        websites, brands, and products end-to-end.
                    </p>
                    <div className="flex gap-3 mt-6 flex-wrap justify-center">
                        <Link target="_blank" href="https://cal.com/aliimam-in/30min">
                            <Button className="h-12 md:h-14 rounded-full cursor-pointer px-8 md:px-10">
                                Book an Intro Call
                            </Button>
                        </Link>
                        <Button
                            variant={"secondary"}
                            className="h-12 md:h-14 cursor-pointer rounded-full px-8 md:px-10"
                        >
                            Get Started Explore
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
