"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, GraduationCap, BookOpen, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

export type TimeLineEntry = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    description: string;
    items?: string[];
    image?: string;
    button?: {
        url: string;
        text: string;
    };
};

export interface TimeLineProps {
    title?: string;
    description?: string;
    entries?: TimeLineEntry[];
    className?: string;
}

const defaultStatsEntries: TimeLineEntry[] = [
    {
        icon: GraduationCap,
        title: "5,000+ Active Students",
        subtitle: "YABATECH Community",
        description:
            "Join thousands of students who trust our digital archive for their academic excellence. Our community is built on resource sharing and collaborative success.",
        items: [
            "Over 5k active monthly users",
            "Verified study materials from top-performing students",
            "Interactive feedback loops for academic support",
            "Peer-to-peer resource validation",
        ],
        image:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
        button: {
            url: "/signup",
            text: "Join Community",
        },
    },
    {
        icon: BookOpen,
        title: "10,000+ Past Questions",
        subtitle: "Complete Digital Archive",
        description:
            "Access a comprehensive collection of past questions spanning over a decade of YABATECH academic history. High-quality scans and digital versions are available.",
        items: [
            "Questions from 2010 to current year",
            "Covers all exam periods (First & Second Semesters)",
            "Digital OCR optimization for searchable text",
            "Downloadable offline PDF support",
        ],
        image:
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    },
    {
        icon: Users,
        title: "40+ Departments Covered",
        subtitle: "All Academic Schools",
        description:
            "Whether you're in Engineering, Management Sciences, or Environmental Studies, we have you covered. We maintain resources for every major niche in the college.",
        items: [
            "School of Engineering & Technology",
            "School of Science & Technology",
            "School of Management & Business Studies",
            "School of Art, Design & Printing",
        ],
        image:
            "https://images.unsplash.com/photo-1541339907198-e087563f975d?w=800&q=80",
        button: {
            url: "/departments",
            text: "Explore Departments",
        },
    },
    {
        icon: Zap,
        title: "Lightning Fast Access",
        subtitle: "Optimized Performance",
        description:
            "Our platform is built for speed. Get what you need in seconds without waiting for slow loading times or cluttered interfaces.",
        items: [
            "Sub-second search results",
            "Optimized PDF compression for low data usage",
            "Progressive loading for image-heavy archives",
            "99.9% Platform uptime guarantee",
        ],
        image:
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
];

export function ReleaseTimeline({
    title = "College Stats & Resources",
    description = "Stay ahead of the curve with our comprehensive digital library. Designed to help YABATECH students excel through easy access to academic history.",
    entries = defaultStatsEntries,
}: TimeLineProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setItemRef = (el: HTMLDivElement | null, i: number) => {
        itemRefs.current[i] = el;
    };
    const setSentinelRef = (el: HTMLDivElement | null, i: number) => {
        sentinelRefs.current[i] = el;
    };

    useEffect(() => {
        if (!sentinelRefs.current.length) return;

        let frame = 0;
        const updateActiveByProximity = () => {
            frame = requestAnimationFrame(updateActiveByProximity);
            const centerY = window.innerHeight / 3;
            let bestIndex = 0;
            let bestDist = Infinity;
            sentinelRefs.current.forEach((node, i) => {
                if (!node) return;
                const rect = node.getBoundingClientRect();
                const mid = rect.top + rect.height / 2;
                const dist = Math.abs(mid - centerY);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIndex = i;
                }
            });
            if (bestIndex !== activeIndex) setActiveIndex(bestIndex);
        };

        frame = requestAnimationFrame(updateActiveByProximity);
        return () => cancelAnimationFrame(frame);
    }, [activeIndex]);

    useEffect(() => {
        setActiveIndex(0);
    }, []);

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            {/* Pattern Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute top-0 left-0 h-320 w-320 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] blur-3xl -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="container relative z-10">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance">
                        <PointerHighlight rectangleClassName="rounded-xl border-blue-500/50" pointerClassName="text-blue-500">{title}</PointerHighlight>
                    </h2>
                    <p className="mb-6 text-base text-muted-foreground md:text-lg lg:text-xl font-light">
                        {description}
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-32">
                    {entries.map((entry, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={index}
                                className="relative flex flex-col gap-4 md:flex-row md:gap-16"
                                ref={(el) => setItemRef(el, index)}
                                aria-current={isActive ? "true" : "false"}
                            >
                                {/* Sticky meta column */}
                                <div className="top-8 flex h-min w-64 shrink-0 items-center gap-4 md:sticky">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-all duration-500 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-muted text-muted-foreground"
                                            }`}>
                                            <entry.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                                {entry.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {entry.subtitle}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Invisible sentinel */}
                                <div
                                    ref={(el) => setSentinelRef(el, index)}
                                    aria-hidden
                                    className="absolute -top-24 left-0 h-12 w-12 opacity-0"
                                />

                                {/* Content column */}
                                <article
                                    className={
                                        "flex flex-col rounded-[2rem] border p-4 transition-all duration-700 ease-in-out " +
                                        (isActive
                                            ? "border-blue-500/30 bg-blue-500/[0.02] dark:bg-blue-900/[0.05] shadow-2xl shadow-blue-500/10 backdrop-blur-xl scale-[1.02]"
                                            : "border-border/50 bg-muted/30 opacity-60 grayscale-[0.5] scale-100")
                                    }
                                >
                                    {entry.image && (
                                        <img
                                            src={entry.image}
                                            alt={`${entry.title} visual`}
                                            className="mb-6 w-full h-80 rounded-2xl object-cover shadow-lg"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="space-y-6 px-4 pb-4">
                                        <div className="space-y-3">
                                            <h3
                                                className={
                                                    "text-xl font-bold leading-tight tracking-tight md:text-2xl transition-colors duration-500 " +
                                                    (isActive ? "text-foreground" : "text-foreground/70")
                                                }
                                            >
                                                {entry.title}
                                            </h3>

                                            <p
                                                className={
                                                    "text-sm leading-relaxed md:text-base transition-all duration-500 " +
                                                    (isActive
                                                        ? "text-muted-foreground line-clamp-none"
                                                        : "text-muted-foreground/80 line-clamp-2")
                                                }
                                            >
                                                {entry.description}
                                            </p>
                                        </div>

                                        {/* Enhanced expandable content */}
                                        <div
                                            aria-hidden={!isActive}
                                            className={
                                                "grid transition-all duration-700 ease-in-out " +
                                                (isActive
                                                    ? "grid-rows-[1fr] opacity-100"
                                                    : "grid-rows-[0fr] opacity-0")
                                            }
                                        >
                                            <div className="overflow-hidden">
                                                <div className="space-y-6 pt-4">
                                                    {entry.items && entry.items.length > 0 && (
                                                        <div className="rounded-2xl border border-border bg-background/50 p-6">
                                                            <ul className="space-y-3">
                                                                {entry.items.map((item, itemIndex) => (
                                                                    <li
                                                                        key={itemIndex}
                                                                        className="flex items-start gap-3 text-sm text-muted-foreground"
                                                                    >
                                                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                                                        <span className="leading-relaxed">{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {entry.button && (
                                                        <div className="flex justify-end pt-2">
                                                            <Button
                                                                variant="default"
                                                                size="lg"
                                                                className="group bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 font-medium transition-all duration-300 active:scale-95"
                                                                asChild
                                                            >
                                                                <a href={entry.button.url}>
                                                                    {entry.button.text}
                                                                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
