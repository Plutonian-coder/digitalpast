"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Share2,
    Bookmark,
    AlertCircle,
    FileText,
    Calendar,
    Clock,
    Layers,
    ExternalLink,
    Loader2
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { supabase, type PastQuestion } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

export default function QuestionDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const [question, setQuestion] = useState<PastQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedQuestions, setRelatedQuestions] = useState<PastQuestion[]>([]);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true);
                // 1. Fetch main question
                const { data, error: fetchError } = await supabase
                    .from('past_questions')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (fetchError) throw fetchError;
                setQuestion(data);

                // 2. Fetch related questions (same department, excluding current)
                const { data: related } = await supabase
                    .from('past_questions')
                    .select('*')
                    .eq('department_id', data.department_id)
                    .neq('id', data.id)
                    .limit(3);

                setRelatedQuestions(related || []);

                // 3. Increment download count (optional, but good for "popular" stat)
                // await supabase.rpc('increment_download', { row_id: params.id });

            } catch (err: any) {
                setError(err.message || "Failed to load question details.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [params.id]);

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return 'N/A';
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 text-center">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-xl sm:text-2xl font-bold mb-2">Oops! Question Not Found</h1>
                <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">{error || "The resource you are looking for might have been moved or deleted."}</p>
                <Link href="/dashboard" className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 text-sm sm:text-base">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-10 selection:bg-blue-500/30 overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
                {/* Breadcrumbs & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group">
                        <div className="p-2 bg-muted border border-border rounded-xl group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-sm font-bold">Back to Dashboard</span>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                        <div className="bg-muted border border-border p-1 rounded-xl">
                            <ModeToggle />
                        </div>
                        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 transition-all">
                            <Share2 size={16} />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 transition-all">
                            <Bookmark size={16} />
                            <span className="hidden sm:inline">Save</span>
                        </button>
                        <a
                            href={question.file_url || "#"}
                            download
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Download ({formatFileSize(question.file_size)})</span>
                            <span className="sm:hidden">Download</span>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {/* Main Content: Metadata & Preview */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        <div className="bg-card border border-border rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm">
                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <span className="px-3 sm:px-4 py-1.5 bg-blue-600 text-[10px] font-bold rounded-lg text-white uppercase tracking-wider">
                                    {question.course_code}
                                </span>
                                <span className="px-3 sm:px-4 py-1.5 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase">
                                    {question.question_type || "THEORY/OBJ"}
                                </span>
                                <span className="px-3 sm:px-4 py-1.5 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase tracking-widest leading-normal">
                                    {question.file_url ? "PDF AVAILABLE" : "DOCX AVAILABLE"}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight text-foreground">{question.course_title}</h1>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-border">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Academic Year</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {question.session}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Semester</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><Clock size={14} className="text-blue-500" /> {question.semester}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Level</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><Layers size={14} className="text-blue-500" /> {question.level}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pages</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><FileText size={14} className="text-blue-500" /> {question.pages || "--"} Pages</p>
                                </div>
                            </div>

                            {/* PDF Preview Area */}
                            <div className="mt-6 sm:mt-10 bg-muted/20 border border-border rounded-2xl sm:rounded-3xl h-[400px] sm:h-[600px] lg:h-[700px] relative overflow-hidden group shadow-inner">
                                {question.file_url ? (
                                    <iframe
                                        src={`${question.file_url}#toolbar=0`}
                                        className="w-full h-full border-none rounded-2xl sm:rounded-3xl"
                                        title={`${question.course_code} Preview`}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full space-y-4 sm:space-y-6 p-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-blue-500 ring-1 ring-blue-500/20">
                                            <FileText size={32} className="sm:w-10 sm:h-10" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg sm:text-xl font-bold mb-2">Preview not available</h3>
                                            <p className="text-muted-foreground text-xs sm:text-sm max-w-xs mx-auto">
                                                This document format cannot be previewed. Please download the file to view its content.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notice Section */}
                        <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                            <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground">
                                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500/50 flex-shrink-0" />
                                <div>
                                    <h5 className="text-xs sm:text-sm font-bold text-foreground">Notice an issue?</h5>
                                    <p className="text-[10px] sm:text-xs">Report discrepancies or missing pages in this question paper.</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold bg-muted border border-border px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-muted/80 transition-all w-full md:w-auto">Report Content</button>
                        </div>
                    </div>

                    {/* Sidebar: Details & Related */}
                    <div className="space-y-6 sm:space-y-8">
                        <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8 shadow-sm">
                            <h3 className="text-lg sm:text-xl font-bold">Document Info</h3>
                            <div className="space-y-6 lowercase">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Downloads</p>
                                    <p className="text-sm font-bold text-blue-500 uppercase tracking-tighter">
                                        {question.download_count} Verified Accesses
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Added to Archive</p>
                                    <p className="text-sm font-bold capitalize">
                                        {formatDistanceToNow(new Date(question.created_at))} ago
                                    </p>
                                </div>
                                <div className="space-y-1 pt-4 border-t border-border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Community Rating</p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <div key={s} className="w-full h-1 bg-blue-600/20 rounded-full">
                                                <div className="w-full h-full bg-blue-600 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[9px] font-bold text-muted-foreground mt-2 uppercase">Verified Resource</p>
                                </div>
                            </div>
                        </div>

                        {/* Related Questions */}
                        <div className="space-y-4 sm:space-y-6">
                            <h3 className="text-lg sm:text-xl font-bold px-1">Related Questions</h3>
                            <div className="space-y-4">
                                {relatedQuestions.map((related) => (
                                    <Link key={related.id} href={`/question/${related.id}`} className="block p-4 sm:p-5 bg-card border border-border rounded-2xl hover:border-blue-500/30 hover:bg-muted transition-all group">
                                        <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-blue-400">
                                            {related.course_code}
                                        </p>
                                        <h4 className="text-sm font-bold text-foreground mb-2 leading-relaxed line-clamp-2">
                                            {related.course_title}
                                        </h4>
                                        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-tight">
                                            {related.session} • {related.semester}
                                        </p>
                                    </Link>
                                ))}
                                {relatedQuestions.length === 0 && (
                                    <p className="text-center text-xs text-muted-foreground italic py-4">No related questions in this department.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
