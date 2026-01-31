"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GridPattern } from '@/components/ui/grid-pattern';
import { PointerHighlight } from '@/components/ui/pointer-highlight';

type Testimonial = {
    name: string;
    role: string;
    image: string;
    company: string;
    quote: string;
};

const testimonials: Testimonial[] = [
    {
        quote:
            "This platform is a life-saver! I used to spend hours looking for past questions, but now I find everything in seconds. My grades have improved significantly.",
        name: 'Olamide Adeyemi',
        role: '300L Student',
        company: 'Engineering',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=faces',
    },
    {
        quote:
            'The PDF quality is amazing. I can download and study even when I don\'t have an active data plan. Truly helpful for YABATECH students.',
        name: 'Blessing Okoro',
        role: 'ND II Student',
        company: 'Computer Science',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    },
    {
        quote:
            'Finally, a reliable archive for exam preparation! The smart search feature makes it so easy to find course codes for my department.',
        name: 'Chinedu Eze',
        role: '400L Student',
        company: 'Accountancy',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    },
    {
        quote:
            'I highly recommend this to every serious student. It takes the stress out of exam prep, giving you more time to actually focus on studying.',
        name: 'Amina Yusuf',
        role: 'ND I Student',
        company: 'Mass Comm',
        image: 'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?w=100&h=100&fit=crop&crop=faces',
    },
    {
        quote:
            'The AI-powered summaries are a game-changer. They help me grasp key concepts from past questions much faster than before.',
        name: 'Samuel Johnson',
        role: 'HND II Student',
        company: 'Business Admin',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    },
    {
        quote:
            'Secure, fast, and very efficient. This is exactly what we needed at YABATECH to modernize our academic resources.',
        name: 'Fatima Ahmed',
        role: '200L Student',
        company: 'Public Admin',
        image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&h=100&fit=crop&crop=faces',
    },
];

export function TestimonialsSection() {
    return (
        <section className="relative w-full pt-24 pb-24 px-4 overflow-hidden">
            {/* Decorative background elements */}
            <div aria-hidden className="absolute inset-0 isolate z-0 contain-strict pointer-events-none">
                <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(59,130,246,0.06)_0,rgba(59,130,246,0.02)_50%,rgba(59,130,246,0.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
                <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.04)_0,rgba(59,130,246,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
            </div>

            <div className="mx-auto max-w-5xl space-y-12 relative z-10">
                <div className="flex flex-col gap-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                        <PointerHighlight rectangleClassName="rounded-xl border-blue-500/50" pointerClassName="text-blue-500">What Our Students Say</PointerHighlight>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        Thousands of YABATECH students are already boosting their grades with our digital archive. Read their success stories.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map(({ name, role, company, quote, image }, index) => (
                        <motion.div
                            initial={{ filter: 'blur(4px)', translateY: 20, opacity: 0 }}
                            whileInView={{
                                filter: 'blur(0px)',
                                translateY: 0,
                                opacity: 1,
                            }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * index, duration: 0.8 }}
                            key={index}
                            className="border-border/50 relative grid grid-cols-[auto_1fr] gap-x-4 overflow-hidden border border-dashed p-6 bg-card/30 backdrop-blur-sm rounded-xl hover:border-blue-500/50 transition-colors"
                        >
                            <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
                                <div className="from-foreground/5 to-foreground/2 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
                                    <GridPattern
                                        width={25}
                                        height={25}
                                        x={-12}
                                        y={4}
                                        strokeDasharray="3"
                                        className="stroke-foreground/10 absolute inset-0 h-full w-full mix-blend-overlay"
                                    />
                                </div>
                            </div>
                            <img
                                alt={name}
                                src={image}
                                loading="lazy"
                                className="size-11 rounded-full object-cover border-2 border-primary/20"
                            />
                            <div>
                                <div className="-mt-0.5 space-y-0.5">
                                    <p className="text-sm md:text-base font-semibold">{name}</p>
                                    <span className="text-muted-foreground block text-xs font-light tracking-tight">
                                        {role}, {company}
                                    </span>
                                </div>
                                <blockquote className="mt-4">
                                    <p className="text-foreground/80 text-sm leading-relaxed italic">
                                        "{quote}"
                                    </p>
                                </blockquote>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
