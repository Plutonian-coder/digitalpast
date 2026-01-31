'use client';

import React from 'react';
import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/grid-feature-cards';
import { PointerHighlight } from '@/components/ui/pointer-highlight';

const features = [
    {
        title: 'Fast Access',
        icon: Zap,
        description: 'Access thousands of past questions instantly with our high-speed servers.',
    },
    {
        title: 'Smart Search',
        icon: Cpu,
        description: 'Find course codes, years, and departments in seconds with optimized search.',
    },
    {
        title: 'Secure Platform',
        icon: Fingerprint,
        description: 'Your study history and profile data are protected with industry-standard security.',
    },
    {
        title: 'Study Anywhere',
        icon: Pencil,
        description: 'Download high-quality PDFs and study offline on any device, anytime.',
    },
    {
        title: 'Organized Content',
        icon: Settings2,
        description: 'Browse through neatly categorized departments and academic years.',
    },
    {
        title: 'AI Study Assistant',
        icon: Sparkles,
        description: 'Get AI-powered insights and summaries to help you understand topics better.',
    },
];

type ViewAnimationProps = {
    delay?: number;
    className?: string;
    children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function WhyChooseGrid() {
    return (
        <section className="py-24 bg-background border-t border-border/50">
            <div className="mx-auto w-full max-w-7xl space-y-16 px-4">
                <AnimatedContainer className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl text-foreground">
                        <PointerHighlight rectangleClassName="rounded-xl border-blue-500/50" pointerClassName="text-blue-500">Power. Speed. Success.</PointerHighlight>
                    </h2>
                    <p className="text-muted-foreground mt-6 text-lg tracking-wide text-balance md:text-xl">
                        Everything you need to excel in your academic journey at YABATECH.
                    </p>
                </AnimatedContainer>

                <AnimatedContainer
                    delay={0.4}
                    className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed border-border/50 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} className="border-border/50" />
                    ))}
                </AnimatedContainer>
            </div>
        </section>
    );
}
