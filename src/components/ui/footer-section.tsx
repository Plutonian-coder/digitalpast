'use client';

import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FacebookIcon, GraduationCap, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';

interface FooterLink {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
    label: string;
    links: FooterLink[];
}

const footerLinks: FooterSection[] = [
    {
        label: 'Platform',
        links: [
            { title: 'Browse Questions', href: '/browse' },
            { title: 'Departments', href: '/departments' },
            { title: 'Pricing', href: '/pricing' },
            { title: 'How it Works', href: '#features' },
        ],
    },
    {
        label: 'Support',
        links: [
            { title: 'FAQs', href: '/faq' },
            { title: 'Contact Us', href: '/contact' },
            { title: 'Report Issue', href: '/report' },
            { title: 'Help Center', href: '/help' },
        ],
    },
    {
        label: 'Legal',
        links: [
            { title: 'Privacy Policy', href: '/privacy' },
            { title: 'Terms of Service', href: '/terms' },
            { title: 'Copyright Info', href: '/copyright' },
            { title: 'Cookie Policy', href: '/cookies' },
        ],
    },
    {
        label: 'Social',
        links: [
            { title: 'Facebook', href: '#', icon: FacebookIcon },
            { title: 'Instagram', href: '#', icon: InstagramIcon },
            { title: 'Youtube', href: '#', icon: YoutubeIcon },
            { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
        ],
    },
];

export function Footer() {
    return (
        <footer className="md:rounded-t-6xl relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(colors.blue.500/5%),transparent)] px-6 py-12 lg:py-16 mt-20">
            <div className="bg-blue-500/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

            <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
                <AnimatedContainer className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg tracking-tight uppercase">Yabatech</span>
                    </div>
                    <p className="text-muted-foreground mt-8 text-sm md:mt-0 max-w-xs leading-relaxed">
                        Your one-stop secure digital archive for academic resources. Built with ❤️ for Yabatech students.
                    </p>
                    <p className="text-muted-foreground text-xs pt-4">
                        © {new Date().getFullYear()} Yabatech. All rights reserved.
                    </p>
                </AnimatedContainer>

                <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
                    {footerLinks.map((section, index) => (
                        <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                            <div className="mb-10 md:mb-0">
                                <h3 className="text-sm font-semibold mb-4">{section.label}</h3>
                                <ul className="text-muted-foreground space-y-3 text-sm">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <a
                                                href={link.href}
                                                className="hover:text-blue-500 inline-flex items-center transition-all duration-300"
                                            >
                                                {link.icon && <link.icon className="me-2 size-4" />}
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedContainer>
                    ))}
                </div>
            </div>
        </footer>
    );
}

type ViewAnimationProps = {
    delay?: number;
    className?: ComponentProps<typeof motion.div>['className'];
    children: ReactNode;
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
