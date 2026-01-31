'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';

interface InputProps {
    label?: string;
    placeholder?: string;
    autoComplete?: string;
    type?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    [key: string]: any;
}

const AppInput = (props: InputProps) => {
    const { label, placeholder, icon, ...rest } = props;
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div className="w-full min-w-[200px] relative">
            {label &&
                <label className='block mb-2 text-sm font-bold text-left text-foreground'>
                    {label}
                </label>
            }
            <div className="relative w-full">
                <input
                    className="peer relative z-10 border-2 border-[var(--color-border)] h-13 w-full rounded-md bg-[var(--color-surface)] px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-medium text-foreground"
                    placeholder={placeholder}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    {...rest}
                />
                {isHovering && (
                    <>
                        <div
                            className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
                            style={{
                                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
                            }}
                        />
                        <div
                            className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
                            style={{
                                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
                            }}
                        />
                    </>
                )}
                {icon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-muted-foreground">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}

export function LoginCard({
    onSubmit,
    error,
    loading,
    email,
    setEmail,
    password,
    setPassword,
    socialIcons
}: {
    onSubmit: (e: React.FormEvent) => void;
    error: string | null;
    loading: boolean;
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    socialIcons: Array<{ icon: React.ReactNode, href: string, gradient?: string, bg?: string }>
}) {
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className='card w-full max-w-4xl flex flex-col md:flex-row h-auto md:h-[600px] overflow-hidden rounded-3xl border border-[var(--color-border)] shadow-2xl bg-[var(--color-bg)]'>
                <div
                    className='w-full md:w-1/2 px-8 md:px-12 py-10 left h-full relative overflow-hidden flex flex-col justify-center'
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}>
                    <div
                        className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{
                            left: mousePosition.x - 250,
                            top: mousePosition.y - 250,
                        }}
                    />
                    <div className="form-container sign-in-container h-full z-10 flex flex-col justify-center">
                        <form className='text-center grid gap-6' onSubmit={onSubmit}>
                            <div className='grid gap-4'>
                                <h1 className='text-3xl md:text-4xl font-extrabold text-foreground'>Sign in</h1>
                                <div className="social-container">
                                    <div className="flex items-center justify-center">
                                        <ul className="flex gap-4">
                                            {socialIcons.map((social, index) => (
                                                <li key={index} className="list-none">
                                                    <a
                                                        href={social.href}
                                                        className={`w-12 h-12 bg-muted/50 rounded-full flex justify-center items-center relative z-[1] border-2 border-[var(--color-border)] overflow-hidden group transition-all hover:border-[var(--color-text-primary)]`}
                                                    >
                                                        <div
                                                            className={`absolute inset-0 w-full h-full ${social.gradient || social.bg || 'bg-blue-600'
                                                                } scale-y-0 origin-bottom transition-transform duration-500 ease-in-out group-hover:scale-y-100`}
                                                        />
                                                        <span className="text-foreground transition-all duration-500 ease-in-out z-[2] group-hover:text-white">
                                                            {social.icon}
                                                        </span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <span className='text-sm text-muted-foreground'>or use your student account</span>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                                    {error}
                                </div>
                            )}

                            <div className='grid gap-4'>
                                <AppInput
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoComplete="email"
                                />
                                <AppInput
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                            <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-blue-500 transition-colors">
                                Forgot your password?
                            </Link>
                            <div className='flex gap-4 justify-center items-center'>
                                <button
                                    disabled={loading}
                                    className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                                >
                                    <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                                        <div className="relative h-full w-8 bg-white/20" />
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='hidden md:block w-1/2 right h-full overflow-hidden relative'>
                    <Image
                        src='https://images.unsplash.com/photo-1541339907198-e087563f975d?w=800&q=80'
                        width={1000}
                        height={1000}
                        priority
                        alt="Archive"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-12 text-white">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Digital Archive</h2>
                        <p className="text-sm font-medium opacity-80">Access thousands of verified past questions and study materials tailored for your success.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
