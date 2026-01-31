"use client";

import * as React from "react"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, GraduationCap } from 'lucide-react'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Browse Archive', href: '/browse' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About Us', href: '/about' },
]

export const HeroSection = () => {
    const [menuState, setMenuState] = React.useState(false)
    return (
        <div className="relative">
            <header>
                <nav
                    data-state={menuState ? 'active' : ''}
                    className="group fixed z-50 w-full border-b border-dashed bg-white/80 backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm font-medium">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm">
                                        <Link href="/login">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Link href="/signup">
                                            <span>Get Started</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-30 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(59,130,246,0.15)_0,rgba(59,130,246,0.05)_50%,transparent_80%)]" />
                </div>

                <section className="overflow-hidden bg-white dark:bg-transparent">
                    <div className="relative mx-auto max-w-5xl px-6 py-20 lg:py-24">
                        <div className="relative z-10 mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-8 animate-fade-in">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Now Supporting All Schools & Departments
                            </div>
                            <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl mb-8">
                                The Ultimate Digital Archive for <span className="text-blue-600 dark:text-blue-500">YABATECH</span> Students
                            </h1>
                            <p className="mx-auto my-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Studying for exams shouldn't be stressful. Access over 10,000+ verified past questions and academic resources in one secure, high-speed digital library.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base font-bold rounded-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                                    <Link href="/browse">
                                        <span>Start Studying</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="px-8 h-12 text-base font-semibold rounded-xl active:scale-95 transition-all">
                                    <Link href="#features">
                                        <span>Learn More</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto -mt-8 max-w-7xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
                        <div className="[perspective:2000px] [mask-image:linear-gradient(to_right,black_60%,transparent_100%)] -mr-16 pl-16 lg:-mr-56 lg:pl-56">
                            <div className="[transform:rotateX(15deg)rotateY(-10deg)rotateZ(2deg);] transition-transform duration-700 hover:[transform:rotateX(10deg)rotateY(-5deg)rotateZ(1deg);]">
                                <div className="lg:h-[40rem] relative skew-x-[.05rad] group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                    <img
                                        className="rounded-[2rem] z-[2] relative border shadow-2xl dark:hidden object-cover w-full h-full"
                                        src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2670&auto=format&fit=crop"
                                        alt="Academic Resources Dashboard"
                                    />
                                    <img
                                        className="rounded-[2rem] z-[2] relative hidden border border-white/10 shadow-2xl dark:block object-cover w-full h-full"
                                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
                                        alt="Academic Resources Dashboard Dark"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-background relative z-10 py-16 border-y border-dashed border-border/50">
                    <div className="m-auto max-w-5xl px-6">
                        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-12">Trusted by Students From</h2>
                        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-20">
                            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default opacity-60 hover:opacity-100">
                                <GraduationCap className="h-6 w-6 text-blue-600" />
                                <span className="font-bold text-lg">Engineering</span>
                            </div>
                            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default opacity-60 hover:opacity-100">
                                <GraduationCap className="h-6 w-6 text-emerald-600" />
                                <span className="font-bold text-lg">Science & Tech</span>
                            </div>
                            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default opacity-60 hover:opacity-100">
                                <GraduationCap className="h-6 w-6 text-purple-600" />
                                <span className="font-bold text-lg">Management</span>
                            </div>
                            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default opacity-60 hover:opacity-100">
                                <GraduationCap className="h-6 w-6 text-orange-600" />
                                <span className="font-bold text-lg">Arts & Design</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <div className="w-8 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
                Digital <span className="text-blue-600">PQ</span>
            </span>
        </div>
    )
}
