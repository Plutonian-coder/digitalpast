"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, type PastQuestion } from "@/lib/supabase";
import { Bookmark, Loader2, Calendar, Clock, Download, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SavedPage() {
    const router = useRouter();
    const [savedQuestions, setSavedQuestions] = useState<(PastQuestion & { saved_at: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        fetchSavedQuestions();
    }, []);

    async function fetchSavedQuestions() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Fetch saved questions with question details
            const { data, error } = await supabase
                .from('saved_questions')
                .select(`
                    id,
                    created_at,
                    question_id,
                    past_questions (*)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to include saved_at
            const questions = data?.map(item => ({
                ...(item.past_questions as any),
                saved_at: item.created_at
            })) || [];

            setSavedQuestions(questions);
        } catch (error) {
            console.error('Error fetching saved questions:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(questionId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setRemovingId(questionId);

        try {
            await supabase
                .from('saved_questions')
                .delete()
                .eq('user_id', user.id)
                .eq('question_id', questionId);

            setSavedQuestions(prev => prev.filter(q => q.id !== questionId));
        } catch (error) {
            console.error('Error removing saved question:', error);
            alert('Failed to remove. Please try again.');
        } finally {
            setRemovingId(null);
        }
    }

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return 'N/A';
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                <h1 className="text-3xl font-bold tracking-tight">Saved Resources</h1>
                <p className="text-muted-foreground mt-2">
                    Your collection of saved past questions and materials.
                </p>
            </div>

            {savedQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/50">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                        <Bookmark className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold italic">No saved items yet</h2>
                    <p className="text-muted-foreground max-w-sm text-center mt-2">
                        Items you save while browsing the archive will appear here for quick access.
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
                            {savedQuestions.length} saved {savedQuestions.length === 1 ? 'question' : 'questions'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {savedQuestions.map((q) => (
                            <div key={q.id} className="bg-card border border-border rounded-[2rem] p-8 group hover:bg-muted transition-all relative">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-blue-500 text-[10px] font-bold rounded-lg text-white">
                                            {q.course_code}
                                        </span>
                                        <span className="px-3 py-1 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase">
                                            {q.question_type}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(q.id)}
                                        disabled={removingId === q.id}
                                        className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                                        title="Remove from saved"
                                    >
                                        {removingId === q.id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold mb-6 group-hover:text-blue-500 transition-colors">{q.course_title}</h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Calendar size={14} className="text-blue-500" />
                                        <span className="text-xs font-medium">{q.session} Session</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Clock size={14} className="text-blue-500" />
                                        <span className="text-xs font-medium">{q.semester}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Bookmark size={14} className="text-green-500" />
                                        <span className="text-xs font-medium">Saved {formatDate(q.saved_at)}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <div className="p-1.5 bg-red-500/10 rounded text-red-500">
                                            <Download size={12} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">PDF • {formatFileSize(q.file_size)}</span>
                                    </div>
                                    <Link
                                        href={`/browse?question=${q.id}`}
                                        className="flex items-center gap-2 text-blue-500 text-xs font-bold hover:underline"
                                    >
                                        View Details
                                        <Eye size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
