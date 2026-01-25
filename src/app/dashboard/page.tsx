"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    BookOpen,
    Clock,
    TrendingUp,
    ArrowRight,
    Monitor,
    Building2,
    HardHat,
    Palette,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, supabase, type PastQuestion, type User } from "@/lib/supabase";

const schools = [
    { name: "School of Technology", details: "CS, Food Tech, etc.", icon: Monitor, slug: "technology" },
    { name: "School of Management", details: "Acc, Bus Admin, etc.", icon: Building2, slug: "management" },
    { name: "School of Engineering", details: "Civil, Elect, Mech.", icon: HardHat, slug: "engineering" },
    { name: "School of Art & Design", details: "Graphics, Fashion, etc.", icon: Palette, slug: "art-design" },
];

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [userName, setUserName] = useState("Student");
    const [recentQuestions, setRecentQuestions] = useState<PastQuestion[]>([]);
    const [stats, setStats] = useState({
        totalQuestions: 0,
        newestQuestion: { code: "N/A", time: "N/A" },
        mostPopular: { code: "N/A", downloads: 0 }
    });

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    async function checkAuthAndFetchData() {
        try {
            // Check if user is authenticated
            const { user: authUser } = await auth.getCurrentUser();

            if (!authUser) {
                router.push('/login');
                return;
            }

            // Fetch user profile
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile) {
                setUser(profile);
                setUserName(profile.full_name.split(' ')[0]); // First name only
            }

            // Fetch total questions count
            const { count: totalCount } = await supabase
                .from('past_questions')
                .select('*', { count: 'exact', head: true });

            // Fetch newest question
            const { data: newest } = await supabase
                .from('past_questions')
                .select('course_code, created_at')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // Fetch most popular question
            const { data: popular } = await supabase
                .from('past_questions')
                .select('course_code, download_count')
                .order('download_count', { ascending: false })
                .limit(1)
                .single();

            // Fetch recent questions (last 3)
            const { data: recent } = await supabase
                .from('past_questions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            setStats({
                totalQuestions: totalCount || 0,
                newestQuestion: newest ? {
                    code: newest.course_code,
                    time: getTimeAgo(newest.created_at)
                } : { code: "N/A", time: "N/A" },
                mostPopular: popular ? {
                    code: popular.course_code,
                    downloads: popular.download_count
                } : { code: "N/A", downloads: 0 }
            });

            setRecentQuestions(recent || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    function getTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const statsData = [
        {
            label: "Total Questions",
            value: stats.totalQuestions.toString(),
            change: `+${Math.floor(stats.totalQuestions * 0.05)} this week`,
            icon: BookOpen,
            color: "text-blue-500"
        },
        {
            label: "Newest Addition",
            value: stats.newestQuestion.code,
            change: `Added ${stats.newestQuestion.time}`,
            icon: Clock,
            color: "text-orange-500"
        },
        {
            label: "Most Popular",
            value: stats.mostPopular.code,
            change: `${stats.mostPopular.downloads} downloads`,
            icon: TrendingUp,
            color: "text-purple-500"
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">{getGreeting()}, {userName}</h1>
                    <p className="text-muted-foreground text-sm">Welcome back to your dashboard</p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search course code, year, or department..."
                        className="w-full bg-muted/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsData.map((stat) => (
                    <div key={stat.label} className="p-6 bg-card border border-border rounded-[2rem] relative overflow-hidden group">
                        <div className={cn("absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity", stat.color)}>
                            <stat.icon size={64} />
                        </div>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">{stat.label}</p>
                        <div className="text-3xl font-bold mb-2">{stat.value}</div>
                        <p className={cn("text-xs font-medium", stat.color)}>{stat.change}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-end">
                        <h3 className="text-xl font-bold">Recent Questions</h3>
                        <button
                            onClick={() => router.push('/browse')}
                            className="text-blue-500 text-sm font-bold hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentQuestions.length === 0 ? (
                            <div className="p-6 bg-card border border-border rounded-3xl text-center text-muted-foreground">
                                No questions available yet
                            </div>
                        ) : (
                            recentQuestions.map((item) => (
                                <div key={item.id} className="p-6 bg-card border border-border rounded-3xl flex items-center justify-between group hover:bg-muted transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 font-bold text-xs ring-1 ring-blue-500/20 group-hover:bg-blue-600/20 transition-all">
                                            {item.course_code.split(' ')[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base mb-1">{item.course_code} - {item.course_title}</h4>
                                            <p className="text-muted-foreground text-xs font-medium">{item.session} Session • {item.semester}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/browse?question=${item.id}`)}
                                        className="px-6 py-2.5 bg-muted border border-border rounded-xl text-xs font-bold transition-all hover:bg-muted/80"
                                    >
                                        View
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Schools & CTA */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold">Browse by School</h3>
                        <div className="space-y-3">
                            {schools.map((school) => (
                                <button
                                    key={school.name}
                                    onClick={() => router.push('/browse')}
                                    className="w-full p-4 bg-card border border-border rounded-2xl flex items-center gap-4 hover:bg-muted transition-all group"
                                >
                                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                                        <school.icon size={20} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h4 className="font-bold text-sm mb-0.5">{school.name}</h4>
                                        <p className="text-muted-foreground text-xs">{school.details}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CTA Card */}
                    <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <BookOpen size={80} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Need Help?</h3>
                        <p className="text-sm mb-6 opacity-90">Contact support or check our FAQ for assistance</p>
                        <button className="px-6 py-3 bg-white text-blue-600 rounded-xl text-sm font-bold hover:bg-white/90 transition-all">
                            Get Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
