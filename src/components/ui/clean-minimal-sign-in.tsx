"use client"

import * as React from "react"
import Link from "next/link";
import { LogIn, Lock, Mail, User, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
    title: string;
    description: string;
    type: "login" | "signup";
    onSubmit: (e: React.FormEvent) => void;
    loading?: boolean;
    error?: string | null;
    success?: boolean;
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    fullName?: string;
    setFullName?: (val: string) => void;
    matricNumber?: string;
    setMatricNumber?: (val: string) => void;
    socialActions?: Array<{
        icon: React.ReactNode;
        label: string;
        onClick: () => void;
    }>;
}

const AuthCard = ({
    title,
    description,
    type,
    onSubmit,
    loading,
    error,
    success,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    matricNumber,
    setMatricNumber,
    socialActions
}: AuthCardProps) => {
    return (
        <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white dark:from-zinc-900 dark:to-zinc-950 rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 dark:border-zinc-800 text-black dark:text-white">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 mb-6 shadow-lg">
                <LogIn className="w-7 h-7 text-black dark:text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">
                {title}
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mb-6 text-center">
                {description}
            </p>

            <form onSubmit={onSubmit} className="w-full flex flex-col gap-3 mb-2">
                {type === "signup" && (
                    <>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <User className="w-4 h-4" />
                            </span>
                            <input
                                placeholder="Full Name"
                                type="text"
                                value={fullName}
                                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm"
                                onChange={(e) => setFullName?.(e.target.value)}
                                required
                                disabled={loading || success}
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Hash className="w-4 h-4" />
                            </span>
                            <input
                                placeholder="Matric Number (Optional)"
                                type="text"
                                value={matricNumber}
                                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm"
                                onChange={(e) => setMatricNumber?.(e.target.value)}
                                disabled={loading || success}
                            />
                        </div>
                    </>
                )}

                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail className="w-4 h-4" />
                    </span>
                    <input
                        placeholder="Email"
                        type="email"
                        value={email}
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading || success}
                    />
                </div>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock className="w-4 h-4" />
                    </span>
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading || success}
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-500 text-center mt-1 font-medium">{error}</div>
                )}
                {success && (
                    <div className="text-sm text-green-500 text-center mt-1 font-medium">Success! Redirecting...</div>
                )}

                <div className="w-full flex justify-end">
                    {type === "login" && (
                        <button type="button" className="text-xs text-gray-500 hover:text-black dark:hover:text-white hover:underline font-medium">
                            Forgot password?
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-gradient-to-b from-gray-700 to-gray-900 dark:from-zinc-700 dark:to-zinc-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-50"
                >
                    {loading ? "Processing..." : (type === "login" ? "Get Started" : "Create Account")}
                </button>
            </form>

            <div className="flex items-center w-full my-2">
                <div className="flex-grow border-t border-dashed border-gray-200 dark:border-zinc-700"></div>
                <span className="mx-2 text-xs text-gray-400">Or {type === "login" ? "sign in" : "sign up"} with</span>
                <div className="flex-grow border-t border-dashed border-gray-200 dark:border-zinc-700"></div>
            </div>

            <div className="flex gap-3 w-full justify-center mt-2">
                <button type="button" className="flex items-center justify-center w-12 h-12 rounded-xl border dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition grow group">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                    />
                </button>
                <button type="button" className="flex items-center justify-center w-12 h-12 rounded-xl border dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition grow group">
                    <img
                        src="https://www.svgrepo.com/show/448224/facebook.svg"
                        alt="Facebook"
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                    />
                </button>
                <button type="button" className="flex items-center justify-center w-12 h-12 rounded-xl border dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition grow group">
                    <img
                        src="https://www.svgrepo.com/show/511330/apple-173.svg"
                        alt="Apple"
                        className="w-5 h-5 group-hover:scale-110 transition-transform dark:invert"
                    />
                </button>
            </div>

            <div className="mt-6 text-center">
                <p className="text-gray-500 dark:text-zinc-400 text-sm">
                    {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <Link
                        href={type === "login" ? "/signup" : "/login"}
                        className="text-black dark:text-white font-semibold hover:underline"
                    >
                        {type === "login" ? "Sign up" : "Login"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export { AuthCard };
