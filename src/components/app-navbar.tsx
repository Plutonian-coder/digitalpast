"use client";

import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { GraduationCap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export function AppNavbar() {
    const navItems = [
        {
            name: "Home",
            link: "/",
        },
        {
            name: "Departments",
            link: "/departments",
        },
        {
            name: "Pricing",
            link: "/pricing",
        },
        {
            name: "Contact",
            link: "/contact",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme } = useTheme();

    const BrandLogo = () => (
        <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-foreground">Yabatech</span>
        </div>
    );

    return (
        <div className="relative w-full z-50">
            <Navbar className="top-0 fixed">
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo>
                        <BrandLogo />
                    </NavbarLogo>

                    <NavItems items={navItems} /> {/* Need to verify this works well with Next.js Links or adapt NavItems to use Link */}

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Link href="/login">
                            <NavbarButton variant="secondary" as="div">Login</NavbarButton>
                        </Link>
                        <Link href="/signup">
                            <NavbarButton variant="primary" as="div" className="bg-blue-600 text-white hover:bg-blue-700">
                                Sign Up
                            </NavbarButton>
                        </Link>
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo>
                            <BrandLogo />
                        </NavbarLogo>
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <Link
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block p-2">{item.name}</span>
                            </Link>
                        ))}
                        <div className="flex w-full flex-col gap-4 mt-4">
                            <div className="flex justify-center">
                                <ModeToggle />
                            </div>
                            <Link href="/login" className="w-full">
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="secondary"
                                    className="w-full"
                                    as="div"
                                >
                                    Login
                                </NavbarButton>
                            </Link>
                            <Link href="/signup" className="w-full">
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    className="w-full bg-blue-600 text-white"
                                    as="div"
                                >
                                    Sign Up
                                </NavbarButton>
                            </Link>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
