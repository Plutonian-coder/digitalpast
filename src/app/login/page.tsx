"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Lock, User, HelpCircle, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { auth } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await auth.signIn(
                formData.email,
                formData.password
            );

            if (signInError) {
                throw signInError;
            }

            if (data.user) {
                // Redirect to dashboard on successful login
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-blue-500/30">
            {/* Theme Toggle Position */}
            <div className="absolute top-8 right-8">
                <ModeToggle />
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

            {/* Login Card */}
            <div className="w-full max-w-md bg-card border border-border backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 ring-1 ring-blue-500/20">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-foreground">Student Login</h1>
                    <p className="text-muted-foreground text-sm text-center">Access the YABATECH Past Question Archive</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <p className="text-red-500 text-sm font-medium">{error}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <User className="w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="student@yabatech.edu.ng"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={loading}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                            <Link href="/forgot-password" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={loading}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Login to Dashboard'
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-500 hover:text-blue-400 transition-colors font-bold ml-1">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-muted-foreground text-xs font-medium cursor-help hover:text-foreground transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span>Need help logging in?</span>
            </div>
        </div>
    );
}

