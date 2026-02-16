import React from 'react';
import {
    Download,
    Eye,
    Calendar,
    Clock,
    Bookmark,
    Loader2,
    FileText,
} from "lucide-react";
import { PastQuestion } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
    results: PastQuestion[];
    loading: boolean;
    query: string;
    onSelectQuestion: (question: PastQuestion) => void;
    onSaveToggle: (id: string) => void;
    savedQuestions: Set<string>;
    savingId: string | null;
}

export function SearchResults({
    results,
    loading,
    query,
    onSelectQuestion,
    onSaveToggle,
    savedQuestions,
    savingId
}: SearchResultsProps) {

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return 'N/A';
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-10 h-full">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Search Results</h1>
                        <p className="text-muted-foreground text-sm">
                            Found {results.length} results for <span className="font-bold text-foreground">"{query}"</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {results.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        No results found matching your query.
                    </div>
                ) : results.map((q) => (
                    <div key={q.id} className="bg-card border border-border rounded-[2rem] p-8 group hover:bg-muted/50 transition-all relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-primary text-[10px] font-bold rounded-lg text-primary-foreground uppercase">
                                    {q.course_code}
                                </span>
                                <span className="px-3 py-1 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase">
                                    {q.question_type}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSaveToggle(q.id);
                                }}
                                disabled={savingId === q.id}
                                className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                    savedQuestions.has(q.id)
                                        ? "bg-primary/10 border-primary/20 text-primary"
                                        : "bg-muted border-border text-muted-foreground hover:text-primary hover:border-primary/20"
                                )}
                            >
                                {savingId === q.id ? "..." : savedQuestions.has(q.id) ? "Saved" : "Save"}
                            </button>
                        </div>

                        <h3 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors line-clamp-2">{q.course_title}</h3>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Calendar size={14} className="text-primary" />
                                <span className="text-xs font-medium">{q.session} Session</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock size={14} className="text-primary" />
                                <span className="text-xs font-medium">{q.semester} • {q.level}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="p-1.5 bg-red-500/10 rounded text-red-500">
                                    <Download size={12} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">PDF • {formatFileSize(q.file_size)}</span>
                            </div>
                            <button
                                onClick={() => onSelectQuestion(q)}
                                className="flex items-center gap-2 text-primary text-xs font-bold hover:underline"
                            >
                                View Details
                                <Eye size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
