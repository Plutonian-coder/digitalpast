"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Lock, User, Mail, BookOpen, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { auth, supabase } from "@/lib/supabase";

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        matricNumber: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate form
            if (!formData.fullName || !formData.email || !formData.password) {
                throw new Error('Please fill in all required fields');
            }

            if (formData.password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Sign up with Supabase (disable email confirmation for development)
            const { data, error: signUpError } = await auth.signUp(
                formData.email,
                formData.password,
                {
                    full_name: formData.fullName,
                    matric_number: formData.matricNumber || undefined
                }
            );

            if (signUpError) {
                throw signUpError;
            }

            if (data.user) {
                // Create user profile in the users table
                try {
                    const { error: profileError } = await supabase
                        .from('users')
                        .insert({
                            id: data.user.id,
                            full_name: formData.fullName,
                            email: formData.email,
                            matric_number: formData.matricNumber || null,
                            role: 'student'
                        });

                    if (profileError) {
                        console.error('Profile creation error:', profileError);
                        // Don't fail the signup if profile creation fails
                        // The user can still login and we can create the profile later
                    }
                } catch (profileErr) {
                    console.error('Profile creation exception:', profileErr);
                }

                setSuccess(true);

                // Auto-login the user after successful signup
                const { error: signInError } = await auth.signIn(
                    formData.email,
                    formData.password
                );

                if (signInError) {
                    // If auto-login fails, redirect to login page
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                } else {
                    // Auto-login successful, redirect to dashboard
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 1500);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create account. Please try again.');
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

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

            {/* Signup Card */}
            <div className="w-full max-w-md bg-card border border-border backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 ring-1 ring-blue-500/20">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-foreground">Create Account</h1>
                    <p className="text-muted-foreground text-sm">Join the YABATECH student archive</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <p className="text-red-500 text-sm font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                        <p className="text-green-500 text-sm font-medium">Account created! Logging you in...</p>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name *</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                    disabled={loading || success}
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm disabled:opacity-50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Matric No</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <BookOpen className="w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="F/HD/18/..."
                                    value={formData.matricNumber}
                                    onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                                    disabled={loading || success}
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address *</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Mail className="w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="student@yabatech.edu.ng"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={loading || success}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password *</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password (min. 6 characters)"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={loading || success}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading || success}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Account...
                            </>
                        ) : success ? (
                            'Account Created!'
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:text-blue-400 transition-colors font-bold ml-1">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

