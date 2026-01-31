"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { WavyBackground } from "@/components/ui/wavy-background";
import { auth } from "@/lib/supabase";
import { AuthCard } from "@/components/ui/clean-minimal-sign-in";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await auth.signIn(
                formData.email,
                formData.password
            );

            if (signInError) throw signInError;
            if (data.user) router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <WavyBackground
            containerClassName="min-h-screen"
            className="w-full flex flex-col items-center justify-center p-4 py-20"
            waveOpacity={0.2}
            blur={10}
        >
            {/* Top Navigation */}
            <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-black dark:text-white hover:opacity-70 transition-all group font-bold bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 dark:border-black/30"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </Link>
                <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/30 dark:border-black/30">
                    <ThemeToggle />
                </div>
            </nav>

            <AuthCard
                title="Sign in with email"
                description="Access your digital archive and study materials instantly."
                type="login"
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                email={formData.email}
                setEmail={(val) => setFormData({ ...formData, email: val })}
                password={formData.password}
                setPassword={(val) => setFormData({ ...formData, password: val })}
            />
        </WavyBackground>
    );
}
