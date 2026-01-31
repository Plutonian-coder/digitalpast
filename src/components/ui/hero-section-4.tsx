'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { cn } from '@/lib/utils'
import { Menu, X, GraduationCap } from 'lucide-react'

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section>
                    <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl tracking-tight">Access Your Past Questions <span className="text-blue-600">Instantly</span></h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground">The most comprehensive digital archive of YABATECH past questions. Download, study, and excel in your exams with ease.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="px-8 text-base bg-blue-600 hover:bg-blue-700 h-12 rounded-xl">
                                        <Link href="/signup">
                                            <span className="text-nowrap font-bold">Get Started Now</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="px-8 text-base h-12 rounded-xl border border-transparent hover:border-border transition-all">
                                        <Link href="/browse">
                                            <span className="text-nowrap font-semibold">Browse Archive</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="relative order-first ml-auto h-56 w-full sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-96 lg:order-last lg:h-[140%] lg:w-2/3">
                                <img
                                    className="h-full w-full object-contain pointer-events-none drop-shadow-2xl"
                                    src="https://images.unsplash.com/photo-1523050335102-c89b1811b127?q=80&w=1200&auto=format&fit=crop"
                                    alt="Academic Resources"
                                />
                                <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent hidden lg:block" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-16 md:pb-32">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row gap-8">
                            <div className="md:max-w-44 md:border-r md:pr-12 md:py-4">
                                <p className="text-center md:text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trusted by Students from</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    duration={30}
                                    gap={100}>
                                    <SchoolLogo name="Engineering" color="text-blue-600" />
                                    <SchoolLogo name="Science & Tech" color="text-emerald-600" />
                                    <SchoolLogo name="Management" color="text-purple-600" />
                                    <SchoolLogo name="Environmental" color="text-orange-600" />
                                    <SchoolLogo name="Art & Design" color="text-pink-600" />
                                    {/* Repeat for smoother loop */}
                                    <SchoolLogo name="Communication" color="text-indigo-600" />
                                </InfiniteSlider>

                                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>

                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-24"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-24"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

function SchoolLogo({ name, color }: { name: string, color: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm grayscale hover:grayscale-0 transition-all cursor-default">
            <GraduationCap className={cn("h-5 w-5", color)} />
            <span className="font-bold text-sm text-foreground/80 tracking-tight whitespace-nowrap">{name}</span>
        </div>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Browse Questions', href: '/browse' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    return (
        <header>
            <nav
                data-state={menuState ? 'active' : ''}
                className="group bg-background/60 fixed z-50 w-full border-b backdrop-blur-xl">
                <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
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

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm font-medium">
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
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-[2rem] border p-8 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-lg font-medium">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-blue-600 block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="font-semibold">
                                    <Link href="/login">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-6 rounded-lg">
                                    <Link href="/signup">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = () => {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block uppercase letter-spacing-widest">
                Yabatech
            </span>
        </div>
    )
}
