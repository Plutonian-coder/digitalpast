"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, type PastQuestion } from "@/lib/supabase";
import { History, Loader2, Calendar, Clock, Download, Eye } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function HistoryPage() {
    const router = useRouter();
    const [downloadHistory, setDownloadHistory] = useState<(PastQuestion & { downloaded_at: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDownloadHistory();
    }, []);

    async function fetchDownloadHistory() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Fetch download history with question details
            const { data, error } = await supabase
                .from('download_history')
                .select(`
                    id,
                    downloaded_at,
                    question_id,
                    past_questions (*)
                `)
                .eq('user_id', user.id)
                .order('downloaded_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            // Transform data to include downloaded_at
            const history = data?.map(item => ({
                ...(item.past_questions as any),
                downloaded_at: item.downloaded_at
            })) || [];

            setDownloadHistory(history);
        } catch (error) {
            console.error('Error fetching download history:', error);
        } finally {
            setLoading(false);
        }
    }

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return 'N/A';
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Access History</h1>
                <p className="text-muted-foreground mt-2">
                    Keep track of your recently viewed and downloaded materials.
                </p>
            </div>

            {downloadHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/50">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                        <History className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold italic">Your history is clear</h2>
                    <p className="text-muted-foreground max-w-sm text-center mt-2">
                        Start exploring the archive to see your activity history here.
                    </p>
                    <Link
                        href="/browse"
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all"
                    >
                        Browse Questions
                    </Link>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {downloadHistory.length} {downloadHistory.length === 1 ? 'download' : 'downloads'} in your history
                        </p>
                    </div>

                    <div className="space-y-4">
                        {downloadHistory.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="bg-card border border-border rounded-3xl p-6 hover:bg-muted transition-all group">
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            {item.course_code.substring(0, 3)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-bold text-base text-foreground group-hover:text-blue-500 transition-colors truncate">
                                                    {item.course_code} - {item.course_title}
                                                </h4>
                                                <span className="px-2 py-1 bg-muted border border-border text-[9px] font-bold rounded-lg text-muted-foreground uppercase shrink-0">
                                                    {item.question_type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="text-blue-500" />
                                                    <span className="text-xs font-medium">{item.session}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="text-blue-500" />
                                                    <span className="text-xs font-medium">{item.semester}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Download size={12} className="text-green-500" />
                                                    <span className="text-xs font-medium">
                                                        Downloaded {formatDistanceToNow(new Date(item.downloaded_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">File Size</p>
                                            <p className="text-sm font-bold">{formatFileSize(item.file_size)}</p>
                                        </div>
                                        <Link
                                            href={`/browse?question=${item.id}`}
                                            className="bg-muted hover:bg-zinc-700 text-foreground px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                                        >
                                            View
                                            <Eye size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
