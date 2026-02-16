"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    Sparkles,
    Crown,
    Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { verifyPayment } from "@/lib/paystack";
import { supabase, auth } from "@/lib/supabase";
import Link from "next/link";

function PaymentCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [transactionData, setTransactionData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!reference) {
            setStatus("failed");
            setError("No transaction reference found");
            return;
        }

        verifyTransaction(reference);
    }, [reference]);

    async function verifyTransaction(ref: string) {
        try {
            setStatus("loading");

            // Verify with Paystack via our API route
            const result = await verifyPayment(ref);

            if (result.success && result.data) {
                if (result.data.status === "success") {
                    setStatus("success");
                    setTransactionData(result.data);

                    // Record the payment and activate subscription
                    await activateSubscription(result.data);
                } else {
                    setStatus("failed");
                    setError(`Payment ${result.data.status}`);
                }
            } else {
                setStatus("failed");
                setError(result.error || "Verification failed");
            }
        } catch (err: any) {
            setStatus("failed");
            setError(err.message || "Something went wrong");
        }
    }

    async function activateSubscription(paymentData: any) {
        try {
            const { user } = await auth.getCurrentUser();
            if (!user) return;

            // Record the payment
            await supabase.from("payments").insert({
                user_id: user.id,
                reference: paymentData.reference,
                amount: paymentData.amount,
                currency: paymentData.currency || "NGN",
                status: "success",
                channel: paymentData.channel,
                paid_at: paymentData.paid_at,
                paystack_transaction_id: String(paymentData.transaction_id),
            });

            // Determine plan from the amount (in kobo)
            // Student = ₦20,000 (2,000,000 kobo), Premium = ₦50,000 (5,000,000 kobo)
            let planId = "student";
            if (paymentData.amount >= 5000000) {
                planId = "premium";
            }

            // Both plans are annual — expires in 1 year
            const now = new Date();
            const expiresAt = new Date(now);
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);

            // Deactivate existing subscription
            await supabase
                .from("subscriptions")
                .update({ status: "expired" })
                .eq("user_id", user.id)
                .eq("status", "active");

            // Create new subscription
            await supabase.from("subscriptions").insert({
                user_id: user.id,
                plan_id: planId,
                status: "active",
                starts_at: now.toISOString(),
                expires_at: expiresAt.toISOString(),
                transaction_reference: paymentData.reference,
            });

        } catch (err) {
            console.error("Error activating subscription:", err);
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                {status === "success" && (
                    <>
                        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] animate-pulse" />
                        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] animate-pulse" style={{ animationDelay: "0.5s" }} />
                    </>
                )}
                {status === "failed" && (
                    <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px] animate-pulse" />
                )}
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <div className={cn(
                    "bg-card border rounded-[2.5rem] p-10 sm:p-14 text-center shadow-2xl transition-all duration-700",
                    status === "success" && "border-emerald-500/20",
                    status === "failed" && "border-red-500/20",
                    status === "loading" && "border-border"
                )}>
                    {/* Loading state */}
                    {status === "loading" && (
                        <div className="space-y-6">
                            <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center">
                                <Loader2 size={40} className="text-blue-500 animate-spin" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
                                <p className="text-muted-foreground text-sm">
                                    Please wait while we confirm your payment with Paystack...
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                {[0, 1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Success state */}
                    {status === "success" && (
                        <div className="space-y-8">
                            <div className="relative">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-[2rem] flex items-center justify-center ring-4 ring-emerald-500/10">
                                    <CheckCircle2 size={48} className="text-emerald-500" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-10 h-10 flex items-center justify-center">
                                    <Sparkles className="text-emerald-500/50 animate-pulse" size={20} />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold mb-3 text-foreground">
                                    Payment Successful! 🎉
                                </h2>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Your plan has been upgraded. You now have access to all premium features.
                                </p>
                            </div>

                            {transactionData && (
                                <div className="bg-muted/30 rounded-2xl p-5 space-y-3 text-left">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Amount</span>
                                        <span className="font-bold text-foreground">
                                            ₦{(transactionData.amount / 100).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Reference</span>
                                        <span className="font-mono text-xs text-foreground">
                                            {transactionData.reference}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Payment Method</span>
                                        <span className="font-bold text-foreground capitalize">
                                            {transactionData.channel}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Link
                                    href="/dashboard"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 active:scale-[0.98]"
                                >
                                    Go to Dashboard
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="/browse"
                                    className="w-full py-4 bg-muted hover:bg-muted/80 text-foreground rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    Start Browsing
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Failed state */}
                    {status === "failed" && (
                        <div className="space-y-8">
                            <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-[2rem] flex items-center justify-center ring-4 ring-red-500/10">
                                <XCircle size={48} className="text-red-500" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold mb-3 text-foreground">
                                    Payment Failed
                                </h2>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {error || "Something went wrong with your payment. No charges were made."}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/pricing"
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-[0.98]"
                                >
                                    Try Again
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="w-full py-4 bg-muted hover:bg-muted/80 text-foreground rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    Back to Dashboard
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Security note */}
                <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
                    <Shield size={14} />
                    <span className="text-xs">Secured by Paystack</span>
                </div>
            </div>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <Loader2 size={32} className="text-blue-500 animate-spin" />
                </div>
            }
        >
            <PaymentCallbackContent />
        </Suspense>
    );
}
