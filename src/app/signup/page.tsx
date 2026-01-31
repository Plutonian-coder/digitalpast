"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { WavyBackground } from "@/components/ui/wavy-background";
import { auth, supabase } from "@/lib/supabase";
import { AuthCard } from "@/components/ui/clean-minimal-sign-in";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        matricNumber: "",
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
            if (!formData.fullName || !formData.email || !formData.password) {
                throw new Error('Please fill in all required fields');
            }

            if (formData.password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const { data, error: signUpError } = await auth.signUp(
                formData.email,
                formData.password,
                {
                    full_name: formData.fullName,
                    matric_number: formData.matricNumber || undefined
                }
            );

            if (signUpError) throw signUpError;

            if (data.user) {
                try {
                    await supabase
                        .from('users')
                        .insert({
                            id: data.user.id,
                            full_name: formData.fullName,
                            email: formData.email,
                            matric_number: formData.matricNumber || null,
                            role: 'student'
                        });
                } catch (profileErr) {
                    console.error('Profile creation error:', profileErr);
                }

                setSuccess(true);
                const { error: signInError } = await auth.signIn(formData.email, formData.password);
                setTimeout(() => {
                    router.push(signInError ? '/login' : '/dashboard');
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create account. Please try again.');
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
                    <span className="hidden sm:inline">Back to Home</span>
                    <span className="sm:hidden">Back</span>
                </Link>
                <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/30 dark:border-black/30">
                    <ThemeToggle />
                </div>
            </nav>

            <AuthCard
                title="Create account"
                description="Join the archive today to start bringing your studies together."
                type="signup"
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={success}
                email={formData.email}
                setEmail={(val) => setFormData({ ...formData, email: val })}
                password={formData.password}
                setPassword={(val) => setFormData({ ...formData, password: val })}
                fullName={formData.fullName}
                setFullName={(val) => setFormData({ ...formData, fullName: val })}
                matricNumber={formData.matricNumber}
                setMatricNumber={(val) => setFormData({ ...formData, matricNumber: val })}
            />
        </WavyBackground>
    );
}
