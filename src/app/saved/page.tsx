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
        try {
            setRemovingId(questionId);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('saved_questions')
                .delete()
                .eq('user_id', user.id)
                .eq('question_id', questionId);

            if (error) throw error;

            // Remove from local state
            setSavedQuestions(prev => prev.filter(q => q.id !== questionId));
        } catch (error) {
            console.error('Error removing saved question:', error);
            alert('Failed to remove. Please try again.');
        } finally {
            setRemovingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-10 overflow-x-hidden">
            {/* Header */}
            <header className="mb-6 sm:mb-8 lg:mb-12">
                <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Saved Questions</h1>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                    {savedQuestions.length} {savedQuestions.length === 1 ? 'question' : 'questions'} saved for later
                </p>
            </header>

            {/* Saved Questions Grid */}
            {savedQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-muted/20 rounded-2xl sm:rounded-3xl border border-dashed border-border/50">
                    <Bookmark className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">No Saved Questions</h3>
                    <p className="text-muted-foreground text-center max-w-md text-sm sm:text-base px-4">
                        Questions you bookmark will appear here for quick access.
                    </p>
                    <Link
                        href="/browse"
                        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-colors text-sm sm:text-base"
                    >
                        Browse Questions
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {savedQuestions.map((question) => (
                        <div
                            key={question.id}
                            className="bg-card border border-border rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 hover:bg-muted transition-all relative group"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 sm:px-3 py-1 bg-blue-500 text-[10px] font-bold rounded-lg text-white">
                                        {question.course_code}
                                    </span>
                                    <span className="px-2 sm:px-3 py-1 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase">
                                        {question.question_type}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleRemove(question.id)}
                                    disabled={removingId === question.id}
                                    className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                                    aria-label="Remove from saved"
                                >
                                    {removingId === question.id ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={18} />
                                    )}
                                </button>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 group-hover:text-blue-500 transition-colors">
                                {question.course_title}
                            </h3>

                            {/* Meta Info */}
                            <div className="space-y-3 mb-6 sm:mb-8">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Calendar size={14} className="text-blue-500" />
                                    <span className="text-xs font-medium">{question.session} Session</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Clock size={14} className="text-blue-500" />
                                    <span className="text-xs font-medium">{question.semester}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Download size={14} className="text-blue-500" />
                                    <span className="text-xs font-medium">{question.download_count} downloads</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Link
                                href={`/question/${question.id}`}
                                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-all text-sm"
                            >
                                <Eye size={16} />
                                View Question
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
