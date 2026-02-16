"use client";

import { useState, useEffect } from "react";
import { supabase, auth, type PastQuestion, type School } from "@/lib/supabase";
import { PLANS, formatNaira, type PaystackSubscription } from "@/lib/paystack";
import {
    Search,
    BookOpen,
    Clock,
    TrendingUp,
    ChevronRight,
    Monitor,
    Briefcase,
    Settings as SettingsIcon,
    PenTool,
    Crown,
    Zap,
    Sparkles,
    Shield,
    Download,
    Star,
    ArrowRight,
    Check,
    CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";

export default function DashboardPage() {
    const [userName, setUserName] = useState("Student");
    const [stats, setStats] = useState({
        totalQuestions: 0,
        addedThisWeek: 0,
        newestQuestion: null as PastQuestion | null,
        mostPopular: null as PastQuestion | null,
    });
    const [recentQuestions, setRecentQuestions] = useState<PastQuestion[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<{
        plan_id: string;
        status: string;
        expires_at: string;
    } | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Get User Info from database
                const { user } = await auth.getCurrentUser();
                if (user) {
                    // Fetch user profile from users table
                    const { data: userProfile } = await supabase
                        .from('users')
                        .select('full_name')
                        .eq('id', user.id)
                        .single();

                    if (userProfile?.full_name) {
                        setUserName(userProfile.full_name.split(' ')[0]);
                    } else if (user.user_metadata?.full_name) {
                        // Fallback to metadata if database profile doesn't exist
                        setUserName(user.user_metadata.full_name.split(' ')[0]);
                    }

                    // Fetch subscription
                    const { data: subData } = await supabase
                        .from('subscriptions')
                        .select('plan_id, status, expires_at')
                        .eq('user_id', user.id)
                        .eq('status', 'active')
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (subData) {
                        setSubscription(subData);
                    }
                }

                // 2. Fetch Total Questions & Added This Week
                const { count: totalCount } = await supabase
                    .from('past_questions')
                    .select('*', { count: 'exact', head: true });

                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                const { count: weekCount } = await supabase
                    .from('past_questions')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', oneWeekAgo.toISOString());

                // 3. Fetch Newest Question
                const { data: newestData } = await supabase
                    .from('past_questions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                // 4. Fetch Most Popular Question
                const { data: popularData } = await supabase
                    .from('past_questions')
                    .select('*')
                    .order('download_count', { ascending: false })
                    .limit(1)
                    .single();

                // 5. Fetch Recent Questions
                const { data: recentData } = await supabase
                    .from('past_questions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(6);

                // 6. Fetch Schools
                const { data: schoolsData } = await supabase
                    .from('schools')
                    .select('*')
                    .order('name');

                setStats({
                    totalQuestions: totalCount || 0,
                    addedThisWeek: weekCount || 0,
                    newestQuestion: newestData,
                    mostPopular: popularData,
                });
                setRecentQuestions(recentData || []);
                setSchools(schoolsData || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const currentPlanId = subscription?.plan_id || "free";
    const currentPlan = PLANS.find(p => p.id === currentPlanId) || PLANS[0];
    const isPremium = currentPlanId !== "free";
    const daysLeft = subscription?.expires_at
        ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 sm:space-y-8 lg:space-y-10 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                        {getTimeGreeting()}, {userName.toLowerCase()}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base lg:text-lg">
                        Welcome back to your dashboard
                    </p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={20} />
                    <input
                        type="text"
                        placeholder="Search course code, year, or department..."
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-muted/50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm text-foreground"
                    />
                </div>
            </div>

            {/* Subscription Status Section */}
            {isPremium ? (
                /* Active Subscription Card */
                <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/5 via-card to-purple-600/5 p-6 sm:p-8 shadow-lg">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ring-4",
                                currentPlanId === "premium"
                                    ? "bg-gradient-to-br from-amber-500 to-orange-600 ring-amber-500/20"
                                    : "bg-gradient-to-br from-blue-500 to-blue-700 ring-blue-500/20"
                            )}>
                                {currentPlanId === "premium"
                                    ? <Crown className="text-white" size={28} />
                                    : <Zap className="text-white" size={28} />
                                }
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-foreground">{currentPlan.name} Plan</h3>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                        Active
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays size={14} />
                                        {daysLeft > 0
                                            ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining`
                                            : 'Expires today'
                                        }
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">
                                        Expires {subscription?.expires_at
                                            ? format(new Date(subscription.expires_at), 'MMM d, yyyy')
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Progress bar for remaining days */}
                            <div className="flex-1 sm:w-40 sm:flex-initial">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            daysLeft > 10
                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                                : daysLeft > 3
                                                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                                    : "bg-gradient-to-r from-red-500 to-red-400"
                                        )}
                                        style={{
                                            width: `${Math.min(100, (daysLeft / (currentPlanId === 'premium' ? 365 : 30)) * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                            <Link
                                href="/pricing"
                                className="px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-bold hover:opacity-90 transition-all active:scale-95 shrink-0"
                            >
                                Manage
                            </Link>
                        </div>
                    </div>

                    {/* Quick feature badges */}
                    <div className="relative mt-6 pt-6 border-t border-border/50 flex flex-wrap gap-3">
                        {currentPlan.features.slice(0, 4).map((feature, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-lg text-xs text-muted-foreground font-medium"
                            >
                                <Check size={12} className="text-emerald-500" />
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                /* Free Plan — Upgrade CTA */
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-blue-600/5 via-card to-purple-600/5 p-6 sm:p-8 shadow-lg group hover:border-blue-500/20 transition-colors">
                    {/* Animated sparkle dots */}
                    <div className="absolute top-4 right-8 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                        <Sparkles size={60} className="rotate-12" />
                    </div>
                    <div className="absolute bottom-2 right-32 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                        <Star size={32} className="-rotate-6" />
                    </div>

                    <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center shrink-0 ring-4 ring-blue-500/5">
                                <BookOpen className="text-blue-500" size={28} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-foreground">Free Plan</h3>
                                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                                        Current
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Upgrade to unlock unlimited downloads, advanced filters, and exclusive study materials.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            {/* Mini plan comparison */}
                            <div className="hidden sm:flex items-center gap-4 mr-4">
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Student Plan</p>
                                    <p className="text-lg font-bold text-foreground">₦20,000<span className="text-xs text-muted-foreground font-normal">/yr</span></p>
                                </div>
                                <div className="w-px h-10 bg-border" />
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Premium Plan</p>
                                    <p className="text-lg font-bold text-foreground">₦50,000<span className="text-xs text-muted-foreground font-normal">/yr</span></p>
                                </div>
                            </div>
                            <Link
                                href="/pricing"
                                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-[0.97] w-full lg:w-auto shrink-0"
                            >
                                <Crown size={16} />
                                Upgrade Now
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* What you're missing */}
                    <div className="relative mt-6 pt-6 border-t border-border/50 flex flex-wrap gap-3">
                        {["Unlimited downloads", "Advanced filters", "Priority access", "Study materials"].map((feature, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs text-blue-500 font-medium"
                            >
                                <Zap size={12} />
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Total Questions */}
                <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:bg-muted/50 transition-all group relative overflow-hidden shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Total Questions</p>
                            <h3 className="text-4xl sm:text-5xl font-bold text-foreground">{stats.totalQuestions}</h3>
                            <p className="text-primary text-sm mt-3 font-semibold">+{stats.addedThisWeek} this week</p>
                        </div>
                        <BookOpen className="text-muted-foreground/20 group-hover:text-primary/20 transition-colors" size={48} strokeWidth={1} />
                    </div>
                </div>

                {/* Newest Question */}
                <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:bg-muted/50 transition-all group relative overflow-hidden shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Latest Addition</p>
                            <div className="mb-2">
                                {stats.newestQuestion ? (
                                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs font-bold mb-2 inline-block">
                                        {stats.newestQuestion.course_code}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground text-sm">N/A</span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold line-clamp-2 text-foreground">{stats.newestQuestion?.course_title || 'No questions yet'}</h3>
                            <p className="text-muted-foreground text-xs mt-2">
                                {stats.newestQuestion ? formatDistanceToNow(new Date(stats.newestQuestion.created_at), { addSuffix: true }) : ''}
                            </p>
                        </div>
                        <Clock className="text-muted-foreground/20 group-hover:text-primary/20 transition-colors" size={48} strokeWidth={1} />
                    </div>
                </div>

                {/* Subscription Status Mini Card */}
                <Link
                    href="/pricing"
                    className="bg-card border border-border p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:bg-muted/50 transition-all group relative overflow-hidden shadow-sm"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Your Plan</p>
                            <h3 className="text-4xl sm:text-5xl font-bold text-foreground">{currentPlan.name}</h3>
                            <p className={cn(
                                "text-sm mt-3 font-semibold",
                                isPremium ? "text-emerald-500" : "text-blue-500"
                            )}>
                                {isPremium
                                    ? `${daysLeft} days left`
                                    : "Upgrade for more →"
                                }
                            </p>
                        </div>
                        {isPremium
                            ? <Crown className="text-amber-500/20 group-hover:text-amber-500/40 transition-colors" size={48} strokeWidth={1} />
                            : <Sparkles className="text-muted-foreground/20 group-hover:text-blue-500/30 transition-colors" size={48} strokeWidth={1} />
                        }
                    </div>
                </Link>
            </div>

            {/* Recent Questions */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Recent Questions</h2>
                    <Link href="/browse" className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                        View All <ChevronRight size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recentQuestions.map((question) => (
                        <Link
                            key={question.id}
                            href={`/browse?question=${question.id}`}
                            className="bg-card border border-border p-6 rounded-2xl hover:bg-muted/50 transition-all group shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase">
                                    {question.course_code}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {question.session}
                                </span>
                            </div>
                            <h3 className="font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {question.course_title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {question.level} • {question.semester}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Schools Grid */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Browse by School</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {schools.map((school) => (
                        <Link
                            key={school.id}
                            href={`/browse?school=${school.id}`}
                            className="bg-card border border-border p-6 rounded-2xl hover:bg-muted/50 transition-all group flex items-center gap-4 shadow-sm"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Monitor className="text-primary" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                    {school.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
