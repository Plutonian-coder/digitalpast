"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Crown,
    Zap,
    BookOpen,
    Check,
    X,
    ArrowLeft,
    Sparkles,
    Shield,
    Loader2,
    Star,
    Download,
    Search,
    Bookmark,
    Clock,
    Headphones,
    Ban,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, supabase } from "@/lib/supabase";
import {
    PLANS,
    formatNaira,
    initializePayment,
    type PaystackPlan,
} from "@/lib/paystack";
import Link from "next/link";

export default function PricingPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [currentPlan, setCurrentPlan] = useState("free");
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchUser = async () => {
            const { user } = await auth.getCurrentUser();
            if (user) {
                setUserEmail(user.email || "");
                setUserId(user.id);

                // Check current subscription
                const { data: subscription } = await supabase
                    .from("subscriptions")
                    .select("plan_id, status")
                    .eq("user_id", user.id)
                    .eq("status", "active")
                    .single();

                if (subscription) {
                    setCurrentPlan(subscription.plan_id);
                }
            }
        };
        fetchUser();
    }, []);

    const handleUpgrade = async (plan: PaystackPlan) => {
        if (plan.id === "free" || plan.id === currentPlan) return;

        if (!userEmail || !userId) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);
            setSelectedPlan(plan.id);
            setError(null);

            const callbackUrl = `${window.location.origin}/payment/callback`;

            const result = await initializePayment({
                email: userEmail,
                amount: plan.priceInKobo,
                planId: plan.id,
                userId: userId,
                callbackUrl: callbackUrl
            });

            if (result.success && result.data) {
                // Redirect to Paystack checkout
                window.location.href = result.data.authorization_url;
            } else {
                setError(result.error || "Failed to initialize payment");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    const getIconForFeature = (feature: string) => {
        if (feature.toLowerCase().includes("download")) return Download;
        if (feature.toLowerCase().includes("search") || feature.toLowerCase().includes("filter")) return Search;
        if (feature.toLowerCase().includes("save")) return Bookmark;
        if (feature.toLowerCase().includes("access") || feature.toLowerCase().includes("priority")) return Clock;
        if (feature.toLowerCase().includes("support")) return Headphones;
        if (feature.toLowerCase().includes("ad-free")) return Ban;
        if (feature.toLowerCase().includes("browse") || feature.toLowerCase().includes("view")) return BookOpen;
        if (feature.toLowerCase().includes("study") || feature.toLowerCase().includes("solution")) return Star;
        if (feature.toLowerCase().includes("history")) return Clock;
        return Check;
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* Animated background gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-emerald-600/3 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Back button */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-sm font-bold">
                        <Sparkles size={16} />
                        Choose Your Plan
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                        Unlock Your{" "}
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                            Full Potential
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        Get unlimited access to past questions, study materials, and premium features to ace your exams.
                    </p>

                    {/* Annual billing info */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-sm font-bold">
                            <Sparkles size={14} />
                            All plans are billed annually
                        </span>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {PLANS.map((plan) => {
                        const isCurrentPlan = plan.id === currentPlan;
                        const isPopular = plan.popular;
                        const isLoading = loading && selectedPlan === plan.id;
                        const price = plan.price;

                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    "relative flex flex-col rounded-[2rem] border transition-all duration-500 hover:scale-[1.02] group",
                                    isPopular
                                        ? "bg-gradient-to-b from-blue-600/10 via-card to-card border-blue-500/30 shadow-2xl shadow-blue-900/10"
                                        : "bg-card border-border hover:border-blue-500/20 shadow-lg",
                                    isCurrentPlan && "ring-2 ring-emerald-500/50"
                                )}
                            >
                                {/* Popular badge */}
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <div className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-xl shadow-blue-900/30">
                                            <Crown size={14} />
                                            MOST POPULAR
                                        </div>
                                    </div>
                                )}

                                {/* Current plan badge */}
                                {isCurrentPlan && (
                                    <div className="absolute -top-4 right-6 z-10">
                                        <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                                            <Check size={14} />
                                            CURRENT
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 sm:p-10 flex-1 flex flex-col">
                                    {/* Plan header */}
                                    <div className="mb-8">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-5",
                                            plan.id === "free" && "bg-muted",
                                            plan.id === "student" && "bg-blue-600/10",
                                            plan.id === "premium" && "bg-gradient-to-br from-amber-500/10 to-orange-500/10"
                                        )}>
                                            {plan.id === "free" && <BookOpen className="text-muted-foreground" size={24} />}
                                            {plan.id === "student" && <Zap className="text-blue-500" size={24} />}
                                            {plan.id === "premium" && <Crown className="text-amber-500" size={24} />}
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-4xl sm:text-5xl font-bold text-foreground">
                                                {plan.price === 0 ? "Free" : formatNaira(price)}
                                            </span>
                                            {plan.price > 0 && (
                                                <span className="text-muted-foreground text-sm font-medium">
                                                    /year
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-4 flex-1 mb-8">
                                        {plan.features.map((feature, i) => {
                                            const FeatureIcon = getIconForFeature(feature);
                                            return (
                                                <li key={i} className="flex items-start gap-3 group/item">
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors",
                                                        plan.id === "free" && "bg-muted text-muted-foreground",
                                                        plan.id === "student" && "bg-blue-500/10 text-blue-500",
                                                        plan.id === "premium" && "bg-amber-500/10 text-amber-500"
                                                    )}>
                                                        <FeatureIcon size={14} />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                                                        {feature}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* CTA button */}
                                    <button
                                        onClick={() => handleUpgrade(plan)}
                                        disabled={plan.id === "free" || isCurrentPlan || isLoading}
                                        className={cn(
                                            "w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                                            plan.id === "free" || isCurrentPlan
                                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                : isPopular
                                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-900/25 active:scale-[0.98]"
                                                    : "bg-foreground text-background hover:opacity-90 active:scale-[0.98]"
                                        )}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : isCurrentPlan ? (
                                            "Current Plan"
                                        ) : plan.id === "free" ? (
                                            "Free Forever"
                                        ) : (
                                            <>
                                                Upgrade Now
                                                <ChevronRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trust badges */}
                <div className="mt-20 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Shield size={20} className="text-emerald-500" />
                            <span className="text-sm font-medium">Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock size={20} className="text-blue-500" />
                            <span className="text-sm font-medium">Instant Access</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Zap size={20} className="text-amber-500" />
                            <span className="text-sm font-medium">Cancel Anytime</span>
                        </div>
                    </div>
                    <p className="mt-6 text-xs text-muted-foreground max-w-md mx-auto">
                        Powered by <strong>Paystack</strong> — Africa&apos;s most trusted payment gateway.
                        Your card details are never stored on our servers.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "How does the payment work?",
                                a: "We use Paystack, Nigeria's most trusted payment platform. You can pay with your debit card, bank transfer, or USSD. Your payment is processed securely and your plan activates instantly."
                            },
                            {
                                q: "Can I cancel my subscription?",
                                a: "Yes! You can cancel anytime from your settings page. Your access will continue until the end of your current billing period."
                            },
                            {
                                q: "What happens when my subscription expires?",
                                a: "You'll automatically be moved back to the Free plan. Your saved questions and history will be preserved, but download access will be limited."
                            },
                            {
                                q: "Is this safe? Can I trust the payment?",
                                a: "Absolutely. Paystack is licensed by the CBN and processes billions in transactions. Your card details are encrypted and never touch our servers."
                            },
                        ].map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-card border border-border rounded-2xl overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-all">
                                    <span className="font-bold text-foreground text-sm">{faq.q}</span>
                                    <ChevronRight size={18} className="text-muted-foreground group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
