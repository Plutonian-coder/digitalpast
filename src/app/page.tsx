"use client";

import { GradientWave } from "@/components/ui/gradient-wave";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, GraduationCap, ArrowRight, Download, Laptop, Zap } from "lucide-react";
import { AppNavbar } from "@/components/app-navbar";
import { cn } from "@/lib/utils";

export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme : "dark";

  const gradientColors = currentTheme === "dark"
    ? ["#000000", "#1e3a8a", "#1e40af", "#1e3a8a", "#000000"] // Deep blue/black for dark mode
    : ["#ffffff", "#fb7185", "#e879f9", "#a3e635", "#ffffff"]; // Original colors for light mode

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      {/* Navigation */}
      <AppNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {mounted && (
            <GradientWave
              colors={gradientColors}
              shadowPower={currentTheme === "dark" ? 8 : 4}
              darkenTop={currentTheme === "dark"}
              noiseFrequency={[0.0001, 0.0002]}
              deform={{ incline: 0.2, noiseAmp: 100, noiseFlow: 2 }}
            />
          )}

          <div className="container mx-auto px-4 text-center z-10">
            <h1 className={cn(
              "text-4xl md:text-7xl font-black tracking-tighter mb-8 max-w-5xl mx-auto leading-[0.9] transition-all",
              currentTheme === "dark" ? "text-white mix-blend-plus-lighter" : "text-black mix-blend-overlay"
            )}>
              Your Academic <br /> Success, Simplified.
            </h1>
            <p className={cn(
              "text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium transition-all",
              currentTheme === "dark" ? "text-blue-100" : "text-black"
            )}>
              Access thousands of YABATECH past questions, lecture notes, and study resources in one secure digital archive. Stop searching, start studying.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/browse" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-2xl shadow-blue-500/20 active:scale-95">
                Browse Past Questions
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/signup" className="w-full md:w-auto bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-10 py-5 rounded-full font-bold transition-all active:scale-95">
                Get Started
              </Link>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by course code (e.g., MTH 101)"
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl py-5 pl-14 pr-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-card border border-border rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-2xl group-hover:bg-blue-600/10 transition-all" />
                <div className="text-blue-500 mb-4 inline-flex p-3 bg-blue-500/10 rounded-2xl">
                  <Laptop className="w-6 h-6" />
                </div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-2">Students Trusted</div>
                <div className="text-4xl font-bold">5,000+</div>
              </div>

              <div className="p-8 bg-card border border-border rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-2xl group-hover:bg-blue-600/10 transition-all" />
                <div className="text-blue-500 mb-4 inline-flex p-3 bg-blue-500/10 rounded-2xl">
                  <Download className="w-6 h-6" />
                </div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-2">Past Questions</div>
                <div className="text-4xl font-bold">10,000+</div>
              </div>

              <div className="p-8 bg-card border border-border rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-2xl group-hover:bg-blue-600/10 transition-all" />
                <div className="text-blue-500 mb-4 inline-flex p-3 bg-blue-500/10 rounded-2xl">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-2">Departments</div>
                <div className="text-4xl font-bold">40+</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Our Platform</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Designed to make your academic journey smoother and more efficient with tools built for success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-10 bg-card border border-border rounded-3xl group hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Access</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Download high-quality PDFs instantly to your device for offline study. No waiting times.
                </p>
              </div>

              <div className="p-10 bg-card border border-border rounded-3xl group hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Search</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Find specific course codes, years, and departments in seconds with our optimized search engine.
                </p>
              </div>

              <div className="p-10 bg-card border border-border rounded-3xl group hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Mobile Friendly</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Fully optimized interface for studying on the go with any smartphone, tablet, or laptop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 container mx-auto px-4">
          <div className="bg-blue-600 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white">Ready to boost your grades?</h2>
              <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed opacity-90">
                Join thousands of YABATECH students who are already studying smarter, not harder.
              </p>
              <Link href="/signup" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">YABATECH Digital PQ</span>
              </div>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                Your one-stop secure digital archive for academic resources. Built with ❤️ for students.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Platform</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/browse" className="hover:text-foreground transition-colors">Browse Questions</Link></li>
                <li><Link href="/departments" className="hover:text-foreground transition-colors">Departments</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Support</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/report" className="hover:text-foreground transition-colors">Report Issue</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2024 Digital PQ. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
