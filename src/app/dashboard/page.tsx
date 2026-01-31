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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-blue-600" size={20} />
                    <input
                        type="text"
                        placeholder="Search course code, year, or department..."
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-zinc-900/50 dark:bg-zinc-900/50 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/50 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Total Questions */}
                <div className="bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:bg-zinc-900/60 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Total Questions</p>
                            <h3 className="text-4xl sm:text-5xl font-bold">{stats.totalQuestions}</h3>
                            <p className="text-blue-500 text-sm mt-3 font-semibold">+{stats.addedThisWeek} this week</p>
                        </div>
                        <BookOpen className="text-zinc-800 group-hover:text-blue-600/20 transition-colors" size={48} strokeWidth={1} />
                    </div>
                </div>

                {/* Newest Question */}
                <div className="bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:bg-zinc-900/60 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Latest Addition</p>
                            <h3 className="text-lg sm:text-xl font-bold mb-2">{stats.newestQuestion?.course_code || 'N/A'}</h3>
                            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">{stats.newestQuestion?.course_title || 'No questions yet'}</p>
                        </div>
                        <Clock className="text-zinc-800 group-hover:text-blue-600/20 transition-colors" size={48} strokeWidth={1} />
                    </div>
                </div>

                {/* Most Popular */}
                <div className="bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:bg-zinc-900/60 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Most Popular</p>
                            <h3 className="text-lg sm:text-xl font-bold mb-2">{stats.mostPopular?.course_code || 'N/A'}</h3>
                            <p className="text-blue-500 text-sm font-semibold">{stats.mostPopular?.download_count || 0} downloads</p>
                        </div>
                        <TrendingUp className="text-zinc-800 group-hover:text-blue-600/20 transition-colors" size={48} strokeWidth={1} />
                    </div>
                </div>
            </div>

            {/* Recent Questions */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold">Recent Questions</h2>
                    <Link href="/browse" className="text-blue-500 hover:text-blue-400 text-sm font-semibold flex items-center gap-1">
                        View All <ChevronRight size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recentQuestions.map((question) => (
                        <Link
                            key={question.id}
                            href={`/question/${question.id}`}
                            className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-900/60 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-blue-600/10 text-blue-500 text-xs font-bold rounded-lg">
                                    {question.course_code}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {question.session}
                                </span>
                            </div>
                            <h3 className="font-bold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
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
                    <h2 className="text-xl sm:text-2xl font-bold">Browse by School</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {schools.map((school) => (
                        <Link
                            key={school.id}
                            href={`/browse?school=${school.id}`}
                            className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-900/60 transition-all group flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                <Monitor className="text-blue-500" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-sm group-hover:text-blue-500 transition-colors line-clamp-2">
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
