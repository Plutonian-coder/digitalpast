"use client";

import { HeroSection } from "@/components/ui/hero-section-3";
import { WhyChooseGrid } from "@/components/ui/why-choose-grid";
import { FeaturesStats } from "@/components/ui/features-stats";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { Footer } from "@/components/ui/footer-section";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      {/* Hero Section with Navigation */}
      <HeroSection />

      <main className="flex-1">


        {/* Stats Section */}
        <FeaturesStats />



        {/* Why Choose Platform Section */}
        <WhyChooseGrid />

        {/* Testimonials Section */}
        <TestimonialsSection />


        {/* CTA Section */}
        <section className="py-24 container mx-auto px-4">
          <div className="bg-blue-600 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white">Ready to boost your grades?</h2>
              <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed opacity-90">
                Join thousands of Yabatech students who are already studying smarter, not harder.
              </p>
              <Link href="/signup" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
