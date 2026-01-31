"use client";

import { useState, useEffect } from "react";
import { supabase, auth, type PastQuestion, type School } from "@/lib/supabase";
import {
    Search,
    BookOpen,
    Clock,
    TrendingUp,
    ChevronRight,
    Monitor,
    Briefcase,
    Settings as SettingsIcon,
    PenTool
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

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

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Get User Info
                const { user } = await auth.getCurrentUser();
                if (user?.user_metadata?.full_name) {
                    setUserName(user.user_metadata.full_name.split(' ')[0]);
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

                // 3. Fetch Newest Addition
                const { data: newest } = await supabase
                    .from('past_questions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                // 4. Fetch Most Popular
                const { data: popular } = await supabase
                    .from('past_questions')
                    .select('*')
                    .order('download_count', { ascending: false })
                    .limit(1)
                    .single();

                // 5. Fetch Recent Questions
                const { data: recent } = await supabase
                    .from('past_questions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);

                // 6. Fetch Schools
                const { data: schoolsData } = await supabase
                    .from('schools')
                    .select('*')
                    .limit(4);

                setStats({
                    totalQuestions: totalCount || 0,
                    addedThisWeek: weekCount || 0,
                    newestQuestion: newest,
                    mostPopular: popular,
                });
                setRecentQuestions(recent || []);
                setSchools(schoolsData || []);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getSchoolIcon = (slug: string) => {
        switch (slug) {
            case 'technology': return <Monitor size={20} />;
            case 'management': return <Briefcase size={20} />;
            case 'engineering': return <SettingsIcon size={20} />;
            case 'art-design': return <PenTool size={20} />;
            default: return <BookOpen size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        {getTimeGreeting()}, {userName.toLowerCase()}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Welcome back to your dashboard
                    </p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-blue-600" size={20} />
                    <input
                        type="text"
                        placeholder="Search course code, year, or department..."
                        className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 dark:bg-zinc-900/50 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/50 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Questions */}
                <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] hover:bg-zinc-900/60 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Total Questions</p>
                            <h3 className="text-5xl font-bold">{stats.totalQuestions}</h3>
                            <p className="text-blue-500 text-sm mt-3 font-semibold">+{stats.addedThisWeek} this week</p>
                        </div>
                        <BookOpen className="text-zinc-800 group-hover:text-blue-600/20 transition-colors" size={48} strokeWidth={1} />
                    </div>
                </div>

                {/* Newest Addition */}
                <Link
                    href={stats.newestQuestion ? `/question/${stats.newestQuestion.id}` : "#"}
                    className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] hover:bg-zinc-900/60 transition-all group relative overflow-hidden block"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Newest Addition</p>
                            <h3 className="text-4xl font-bold truncate max-w-[200px]">
                                {stats.newestQuestion?.course_code || "---"}
                            </h3>
                            <p className="text-orange-500 text-sm mt-3 font-semibold">
                                Added {stats.newestQuestion ? formatDistanceToNow(new Date(stats.newestQuestion.created_at)) : "--"} ago
                            </p>
                        </div>
                        <Clock className="text-zinc-800 group-hover:text-orange-600/20 transition-colors" size={48} strokeWidth={1} />
                    </div>
                </Link>

                {/* Most Popular */}
                <Link
                    href={stats.mostPopular ? `/question/${stats.mostPopular.id}` : "#"}
                    className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] hover:bg-zinc-900/60 transition-all group relative overflow-hidden block"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Most Popular</p>
                            <h3 className="text-4xl font-bold truncate max-w-[200px]">
                                {stats.mostPopular?.course_code || "---"}
                            </h3>
                            <p className="text-purple-500 text-sm mt-3 font-semibold">
                                {stats.mostPopular?.download_count || 0} downloads
                            </p>
                        </div>
                        <TrendingUp className="text-zinc-800 group-hover:text-purple-600/20 transition-colors" size={48} strokeWidth={1} />
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
                {/* Recent Questions List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold tracking-tight">Recent Questions</h2>
                        <Link href="/browse" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1 transition-colors">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentQuestions.map((pq) => (
                            <div key={pq.id} className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-3xl hover:bg-zinc-900/60 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        {pq.course_code.substring(0, 3)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base text-foreground group-hover:text-blue-500 transition-colors">
                                            {pq.course_code} - {pq.course_title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                                            {pq.session} Session • {pq.semester}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={`/question/${pq.id}`}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                                >
                                    View
                                </Link>
                            </div>
                        ))}
                        {recentQuestions.length === 0 && (
                            <div className="text-center py-12 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                                <p className="text-muted-foreground font-medium italic">No questions found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Browse by School */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight px-2">Browse by School</h2>
                    <div className="flex flex-col gap-4">
                        {schools.map((school) => (
                            <Link
                                key={school.id}
                                href={`/browse?school=${school.slug}`}
                                className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-3xl hover:bg-zinc-900/60 hover:border-blue-600/30 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        {getSchoolIcon(school.slug)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-foreground">{school.name}</h4>
                                        <p className="text-[10px] text-muted-foreground mt-1 max-w-[150px] line-clamp-1 font-medium italic">
                                            {school.description || "Explore departments"}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
                            </Link>
                        ))}
                        {schools.length === 0 && [
                            { name: "School of Technology", desc: "CS, Food Tech, etc.", slug: "technology" },
                            { name: "School of Management", desc: "Acc, Bus Admin, etc.", slug: "management" },
                            { name: "School of Engineering", desc: "Civil, Elect, Mech.", slug: "engineering" },
                            { name: "School of Art & Design", desc: "Graphics, Fashion, etc.", slug: "art-design" }
                        ].map((school, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-3xl flex items-center justify-between opacity-60">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-muted-foreground">
                                        {getSchoolIcon(school.slug)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-foreground">{school.name}</h4>
                                        <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">{school.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-zinc-600" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
