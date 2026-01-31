"use client";

import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { Download, Search, Laptop, Shield, Clock, BookOpen, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PinContainer } from "@/components/ui/3d-pin";

const features = [
    {
        icon: Download,
        title: "Instant Access",
        description: "Download high-quality PDFs instantly to your device for offline study. No waiting times.",
        color: "blue",
        href: "/browse"
    },
    {
        icon: Search,
        title: "Smart Search",
        description: "Find specific course codes, years, and departments in seconds with our optimized search engine.",
        color: "purple",
        href: "/search"
    },
    {
        icon: Laptop,
        title: "Mobile Friendly",
        description: "Fully optimized interface for studying on the go with any smartphone, tablet, or laptop.",
        color: "green",
        href: "/browse"
    },
    {
        icon: Shield,
        title: "Secure & Verified",
        description: "All past questions are verified and authenticated to ensure accuracy and reliability.",
        color: "red",
        href: "/about"
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description: "Access your study materials anytime, anywhere. Study at your own pace, on your schedule.",
        color: "orange",
        href: "/signup"
    },
    {
        icon: BookOpen,
        title: "Comprehensive Library",
        description: "Over 10,000 past questions covering 40+ departments and multiple academic years.",
        color: "cyan",
        href: "/departments"
    },
];

const stats = [
    { value: "5,000+", label: "Active Students" },
    { value: "10,000+", label: "Past Questions" },
    { value: "40+", label: "Departments" },
    { value: "99.9%", label: "Uptime" },
];

const colorMap = {
    blue: "bg-blue-600/10 text-blue-500 group-hover:bg-blue-600/20",
    purple: "bg-purple-600/10 text-purple-500 group-hover:bg-purple-600/20",
    green: "bg-green-600/10 text-green-500 group-hover:bg-green-600/20",
    red: "bg-red-600/10 text-red-500 group-hover:bg-red-600/20",
    orange: "bg-orange-600/10 text-orange-500 group-hover:bg-orange-600/20",
    cyan: "bg-cyan-600/10 text-cyan-500 group-hover:bg-cyan-600/20",
};

export function WhyChoosePlatform() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

            <div className="container mx-auto px-4">
                {/* Header with PointerHighlight */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                            Why Choose{" "}
                            <PointerHighlight
                                rectangleClassName="border-2 border-blue-500"
                                pointerClassName="text-blue-500"
                            >
                                <span className="text-blue-600 dark:text-blue-400">Our Platform</span>
                            </PointerHighlight>
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        Designed to make your academic journey{" "}
                        <span className="text-foreground font-semibold">smoother</span> and more{" "}
                        <span className="text-foreground font-semibold">efficient</span> with tools built for success.
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="text-center p-6 bg-card border border-border rounded-2xl hover:border-blue-500/50 transition-all group"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-8 mt-12">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="flex items-center justify-center">
                                <PinContainer title={feature.title} href={feature.href}>
                                    <div className="flex basis-[20rem] flex-col p-4 tracking-tight text-slate-100/50 sm:basis-[20rem] h-[20rem]">
                                        <div
                                            className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all",
                                                colorMap[feature.color as keyof typeof colorMap]
                                            )}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                                            {feature.title}
                                        </h3>
                                        <div className="text-base !m-0 !p-0 font-normal">
                                            <span className="text-slate-500 text-sm">
                                                {feature.description}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                                            <div className="relative z-10 flex flex-col items-center gap-2">
                                                <div className="w-12 h-1 bg-blue-500 rounded-full animate-pulse" />
                                                <span className="text-xs uppercase tracking-widest text-slate-400">Verified Content</span>
                                            </div>
                                        </div>
                                    </div>
                                </PinContainer>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>Join 5,000+ students already studying smarter</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
