'use client'
import React from 'react'
import { Mail, SendHorizonal, Menu, X, GraduationCap, BookOpen, Shield, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { WavyBackground } from '@/components/ui/wavy-background'
import { PointerHighlight } from '@/components/ui/pointer-highlight'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            } as const,
        },
    },
}

export function HeroSection() {
    return (
        <div className="relative">
            <HeroHeader />

            <main className="overflow-hidden">
                <section className="relative min-h-screen flex items-center">
                    <WavyBackground
                        className="w-full"
                        containerClassName="relative z-0 w-full"
                        waveOpacity={0.3}
                        blur={15}
                    >
                        <div className="relative mx-auto max-w-6xl px-6 pt-44 lg:pt-60 pb-32">
                            <div className="relative z-10 mx-auto max-w-4xl text-center">
                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.1,
                                                    delayChildren: 0.5,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                        </span>
                                        Official Digital Archive for Yabatech
                                    </div>
                                    <h1
                                        className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                                        Study Smarter with <PointerHighlight rectangleClassName="rounded-xl border-blue-500/50" pointerClassName="text-blue-500"><span className="text-blue-600">Verified</span></PointerHighlight> Past Questions
                                    </h1>

                                    <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
                                        Access the most comprehensive digital library of Yabatech past questions. Download, study, and excel in your exams with our secure high-speed archive.
                                    </p>

                                    <form
                                        action=""
                                        className="mt-12 mx-auto max-w-sm">
                                        <div className="bg-background has-[input:focus]:ring-blue-500/20 relative grid grid-cols-[1fr_auto] pr-1.5 items-center rounded-2xl border shadow-xl shadow-blue-500/5 has-[input:focus]:ring-4 lg:pr-0 transition-all duration-300">
                                            <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4 text-muted-foreground" />

                                            <input
                                                placeholder="Enter your student email"
                                                className="h-14 w-full bg-transparent pl-12 focus:outline-none text-base font-medium"
                                                type="email"
                                            />

                                            <div className="md:pr-1.5 lg:pr-0">
                                                <Button
                                                    aria-label="submit"
                                                    size="sm"
                                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 h-11 px-6 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                                    <span className="hidden md:block font-bold">Get Started</span>
                                                    <SendHorizonal
                                                        className="relative mx-auto size-5 md:hidden"
                                                        strokeWidth={2}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </form>

                                    <div
                                        aria-hidden
                                        className="bg-radial from-blue-500/10 dark:from-blue-500/5 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left"
                                    >
                                        <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_95%)] sm:-translate-x-6">
                                            <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_6px)] before:opacity-30"></div>
                                        </div>
                                        <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_95%)] sm:translate-x-8">
                                            <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-2xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                                                <AppComponent />

                                                <div className="bg-muted rounded-[1rem] p-4 pb-20 dark:bg-white/5 relative">
                                                    <div className="flex items-center gap-3 mb-4 opacity-50">
                                                        <div className="w-8 h-8 rounded-lg bg-border flex items-center justify-center">
                                                            <Shield className="w-4 h-4" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <div className="h-2 w-24 bg-border rounded-full" />
                                                            <div className="h-1.5 w-16 bg-border/60 rounded-full" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 opacity-30">
                                                        <div className="h-2 w-full bg-border rounded-full" />
                                                        <div className="h-2 w-5/6 bg-border rounded-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 dark:opacity-5" />
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>
                    </WavyBackground>
                </section>
                <LogoCloud />
            </main>
        </div>
    )
}

const AppComponent = () => {
    return (
        <div className="relative space-y-4 rounded-[1.2rem] bg-blue-50/50 dark:bg-blue-900/10 p-5 border border-blue-100/50 dark:border-blue-800/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <BookOpen className="size-5" />
                    <div className="text-sm font-bold uppercase tracking-wider">Exam Tracker</div>
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">LIVE</div>
            </div>
            <div className="space-y-4">
                <div className="text-foreground leading-snug text-sm font-semibold">Great job! You've downloaded 12 more past questions this week than last year.</div>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex items-end justify-between">
                            <span className="text-foreground text-2xl font-black">10,482</span>
                            <span className="text-muted-foreground text-[10px] font-bold uppercase mb-1">Total Resources</span>
                        </div>
                        <div className="relative h-2.5 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600 rounded-full w-[85%] shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-border/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Download className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground font-bold">RECENT FEEDBACK</div>
                                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">"95% match with exams"</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Browse Archive', href: '/browse' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About Us', href: '/about' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                data-state={menuState ? 'active' : ''}
                className="fixed group z-50 w-full px-2">
                <div className={cn('mx-auto mt-4 max-w-6xl px-6 transition-all duration-500 lg:px-12 py-1', isScrolled && 'bg-background/80 shadow-2xl shadow-blue-500/10 max-w-4xl rounded-2xl border backdrop-blur-xl lg:px-6')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-2 lg:gap-0 lg:py-3">
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
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-foreground">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-300" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-300" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm font-semibold">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 block duration-150 transition-colors">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-8 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-lg font-bold">
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
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 md:w-fit">
                                <ThemeToggle className="sm:mr-2" />
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className={cn("font-bold transition-all", isScrolled && 'lg:hidden')}>
                                    <Link href="/login">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn("bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-lg shadow-lg shadow-blue-600/20 transition-all", isScrolled && 'lg:hidden')}>
                                    <Link href="/signup">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn("bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-8 rounded-lg shadow-lg shadow-blue-600/20 animate-fade-in", isScrolled ? 'lg:inline-flex' : 'hidden')}>
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
    )
}

const LogoCloud = () => {
    return (
        <section className="bg-background py-20 md:py-32 border-b border-dashed border-border/50">
            <div className="group relative m-auto max-w-6xl px-6">
                <div className="flex flex-col items-center md:flex-row gap-8">
                    <div className="inline md:max-w-44 md:border-r md:pr-12 py-2">
                        <p className="text-center md:text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Trusted by Schools</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            duration={35}
                            gap={100}>
                            <SchoolLogo name="Engineering" color="text-blue-600" />
                            <SchoolLogo name="Science & Tech" color="text-emerald-600" />
                            <SchoolLogo name="Management" color="text-purple-600" />
                            <SchoolLogo name="Environmental" color="text-orange-600" />
                            <SchoolLogo name="Art & Design" color="text-pink-600" />
                            <SchoolLogo name="Communication" color="text-indigo-600" />
                        </InfiniteSlider>

                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>

                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
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

const Logo = () => {
    return (
        <span className="font-extrabold text-xl tracking-tighter uppercase">
            Yabatech
        </span>
    )
}
