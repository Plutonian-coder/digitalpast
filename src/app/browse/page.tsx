"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Search,
    Filter,
    ChevronDown,
    Download,
    Eye,
    Calendar,
    Clock,
    BookOpen,
    X,
    Loader2,
    Save,
    Share2,
    Maximize2,
    FileText,
    AlertCircle,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase, type PastQuestion, type Department, type School } from "@/lib/supabase";

function BrowseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [questions, setQuestions] = useState<PastQuestion[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchool, setSelectedSchool] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedSession, setSelectedSession] = useState<string>("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<PastQuestion | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Save/Download state
    const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);

    const filters = {
        levels: ["ND 1", "ND 2", "HND 1", "HND 2"],
    };

    const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchData();
        fetchSavedQuestions();
    }, [selectedLevel, selectedDepartment, selectedSession, selectedSchool, sortBy, debouncedSearch]);

    // Fetch saved questions on mount
    useEffect(() => {
        fetchSavedQuestions();
    }, []);

    // Handle modal from query param
    useEffect(() => {
        const questionId = searchParams.get("question");
        if (questionId) {
            fetchQuestionDetails(questionId);
        } else {
            setIsModalOpen(false);
            setSelectedQuestion(null);
        }
    }, [searchParams]);

    async function fetchData() {
        try {
            setLoading(true);
            setError(null);

            // Fetch schools if not loaded
            if (schools.length === 0) {
                const { data: schoolsData } = await supabase
                    .from('schools')
                    .select('*')
                    .order('name');
                setSchools(schoolsData || []);
            }

            // Fetch departments if not loaded or if school changed
            const { data: depsData } = await supabase
                .from('departments')
                .select('*')
                .order('name');
            setDepartments(depsData || []);

            // Build dynamic query
            let query = supabase
                .from('past_questions')
                .select('*');

            // Apply Filters
            if (selectedLevel) query = query.eq('level', selectedLevel);
            if (selectedDepartment) {
                query = query.eq('department_id', selectedDepartment);
            } else if (selectedSchool) {
                const schoolDepts = (depsData || departments)
                    .filter(d => d.school_id === selectedSchool)
                    .map(d => d.id);
                if (schoolDepts.length > 0) {
                    query = query.in('department_id', schoolDepts);
                }
            }
            if (selectedSession) query = query.eq('session', selectedSession);

            // Search Query
            if (debouncedSearch) {
                query = query.or(`course_code.ilike.%${debouncedSearch}%,course_title.ilike.%${debouncedSearch}%`);
            }

            // Apply Sorting
            if (sortBy === "newest") {
                query = query.order('created_at', { ascending: false });
            } else {
                query = query.order('download_count', { ascending: false });
            }

            const { data: questionsData, error: questionsError } = await query;

            if (questionsError) throw questionsError;
            setQuestions(questionsData || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }

    async function fetchQuestionDetails(id: string) {
        try {
            setModalLoading(true);
            setIsModalOpen(true);
            const { data, error } = await supabase
                .from('past_questions')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setSelectedQuestion(data);
        } catch (err) {
            console.error("Error fetching question details:", err);
            setIsModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    }

    const closeDetails = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("question");
        router.push(`/browse?${params.toString()}`, { scroll: false });
    };

    const openDetails = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("question", id);
        router.push(`/browse?${params.toString()}`, { scroll: false });
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return 'N/A';
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    // Fetch user's saved questions
    async function fetchSavedQuestions() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('saved_questions')
                .select('question_id')
                .eq('user_id', user.id);

            if (data) {
                setSavedQuestions(new Set(data.map(sq => sq.question_id)));
            }
        } catch (error) {
            console.error('Error fetching saved questions:', error);
        }
    }

    // Handle download with tracking
    const handleDownload = async (questionId: string, fileUrl: string) => {
        if (!fileUrl) return;

        setDownloadingId(questionId);

        try {
            // Increment download count
            const { data: currentQuestion } = await supabase
                .from('past_questions')
                .select('download_count')
                .eq('id', questionId)
                .single();

            if (currentQuestion) {
                await supabase
                    .from('past_questions')
                    .update({ download_count: (currentQuestion.download_count || 0) + 1 })
                    .eq('id', questionId);
            }

            // Track in history if user is authenticated
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('download_history')
                    .insert({
                        user_id: user.id,
                        question_id: questionId
                    });
            }

            // Trigger download
            window.open(fileUrl, '_blank');

            // Refresh questions to show updated count
            fetchData();
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    // Handle save/unsave question
    const handleSaveToggle = async (questionId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        setSavingId(questionId);
        const isSaved = savedQuestions.has(questionId);

        try {
            if (isSaved) {
                // Unsave
                await supabase
                    .from('saved_questions')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('question_id', questionId);

                setSavedQuestions(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(questionId);
                    return newSet;
                });
            } else {
                // Save
                await supabase
                    .from('saved_questions')
                    .insert({
                        user_id: user.id,
                        question_id: questionId
                    });

                setSavedQuestions(prev => new Set(prev).add(questionId));
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save. Please try again.');
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden text-foreground">
            {/* Filter Sidebar */}
            <aside className="w-80 border-r border-border flex flex-col bg-card/50 overflow-y-auto">
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-500" />
                        Filter Results
                    </h2>
                    <button
                        onClick={() => {
                            setSelectedSchool("");
                            setSelectedDepartment("");
                            setSelectedSession("");
                            setSelectedLevel("");
                        }}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Reset
                    </button>
                </div>

                <div className="p-8 space-y-10">
                    {/* School Filter */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">School</label>
                        <div className="relative">
                            <select
                                value={selectedSchool}
                                onChange={(e) => {
                                    setSelectedSchool(e.target.value);
                                    setSelectedDepartment("");
                                }}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground"
                            >
                                <option value="">All Schools</option>
                                {schools.map(s => <option key={s.id} value={s.id} className="bg-background">{s.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* Department Filter */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Department</label>
                        <div className="relative">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground"
                            >
                                <option value="">All Departments</option>
                                {departments
                                    .filter(d => !selectedSchool || d.school_id === selectedSchool)
                                    .map(d => <option key={d.id} value={d.id} className="bg-background">{d.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* Level Filter */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Level</label>
                        <div className="grid grid-cols-2 gap-2">
                            {filters.levels.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    className={cn(
                                        "py-2.5 rounded-xl text-xs font-bold border transition-all",
                                        selectedLevel === level
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20"
                                            : "bg-muted border-border text-muted-foreground hover:border-foreground/20"
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Session Year */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Session Year</label>
                        <div className="relative">
                            <select
                                value={selectedSession}
                                onChange={(e) => setSelectedSession(e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground"
                            >
                                <option value="">All Years</option>
                                <option className="bg-background">2023/2024</option>
                                <option className="bg-background">2022/2023</option>
                                <option className="bg-background">2021/2022</option>
                                <option className="bg-background">2020/2021</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    <button
                        onClick={fetchData}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-95"
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-background">
                {/* Header */}
                <header className="h-20 border-b border-border flex items-center justify-between px-10 bg-background/50 backdrop-blur-xl">
                    <div className="relative w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by course code, title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-foreground"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-muted-foreground">{selectedLevel || "All Levels"}</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-border" />
                    </div>
                </header>

                {/* Results Info */}
                <div className="p-10 pb-0 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Past Questions</h1>
                        <p className="text-muted-foreground text-sm">
                            {loading ? 'Loading...' : `Showing ${questions.length} past questions found`}
                        </p>
                    </div>
                    <div className="flex bg-muted border border-border rounded-2xl p-1">
                        <button
                            onClick={() => setSortBy("newest")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                sortBy === "newest" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Newest First
                        </button>
                        <button
                            onClick={() => setSortBy("popular")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                sortBy === "popular" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Most Popular
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="flex-1 p-10 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {questions.map((q) => (
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
                                            onClick={() => handleSaveToggle(q.id)}
                                            disabled={savingId === q.id}
                                            className={cn(
                                                "transition-colors",
                                                savedQuestions.has(q.id)
                                                    ? "text-blue-500"
                                                    : "text-muted-foreground hover:text-blue-500"
                                            )}
                                        >
                                            <BookOpen size={18} fill={savedQuestions.has(q.id) ? "currentColor" : "none"} />
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
                                    </div>

                                    <div className="pt-6 border-t border-border flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <div className="p-1.5 bg-red-500/10 rounded text-red-500">
                                                <Download size={12} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">PDF • {formatFileSize(q.file_size)}</span>
                                        </div>
                                        <button
                                            onClick={() => openDetails(q.id)}
                                            className="flex items-center gap-2 text-blue-500 text-xs font-bold hover:underline"
                                        >
                                            View Details
                                            <Eye size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && questions.length > 0 && (
                        <div className="mt-12 flex justify-center items-center gap-2">
                            {[1].map((page, i) => (
                                <button
                                    key={i}
                                    className={cn(
                                        "w-10 h-10 rounded-xl text-sm font-bold border transition-all",
                                        page === 1
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20"
                                            : "bg-card border-border text-muted-foreground hover:border-foreground/20"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Question Detail Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeDetails} />
                    <div className="relative w-full max-w-6xl h-full bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                        {modalLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            </div>
                        ) : selectedQuestion ? (
                            <>
                                {/* Modal Header */}
                                <div className="p-8 border-b border-border flex justify-between items-start">
                                    <div className="flex gap-6">
                                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 ring-1 ring-blue-500/20">
                                            <FileText size={32} />
                                        </div>
                                        <div>
                                            <div className="flex gap-2 mb-2">
                                                <span className="px-3 py-1 bg-blue-500 text-[10px] font-bold rounded-lg text-white uppercase">
                                                    {selectedQuestion.course_code}
                                                </span>
                                                <span className="px-3 py-1 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase">
                                                    {selectedQuestion.level}
                                                </span>
                                                <span className="px-3 py-1 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase">
                                                    {selectedQuestion.question_type}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-foreground">{selectedQuestion.course_title}</h2>
                                            <p className="text-muted-foreground text-sm font-medium">
                                                {selectedQuestion.session} Session • {selectedQuestion.semester}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => selectedQuestion && handleSaveToggle(selectedQuestion.id)}
                                            disabled={!selectedQuestion || savingId === selectedQuestion?.id}
                                            className={cn(
                                                "p-3 bg-muted border border-border rounded-xl transition-all",
                                                selectedQuestion && savedQuestions.has(selectedQuestion.id)
                                                    ? "text-blue-500 border-blue-500"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                            title={selectedQuestion && savedQuestions.has(selectedQuestion.id) ? "Unsave" : "Save"}
                                        >
                                            <Save size={20} fill={selectedQuestion && savedQuestions.has(selectedQuestion.id) ? "currentColor" : "none"} />
                                        </button>
                                        <button className="p-3 bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all">
                                            <Share2 size={20} />
                                        </button>
                                        <button onClick={closeDetails} className="p-3 bg-muted border border-border rounded-xl text-muted-foreground hover:text-red-500 transition-all">
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 flex overflow-hidden">
                                    {/* PDF Preview Area */}
                                    <div className="flex-1 bg-muted/30 p-8 overflow-hidden flex flex-col">
                                        <div className="flex-1 bg-white rounded-3xl overflow-hidden shadow-inner border border-border relative">
                                            {selectedQuestion.file_url ? (
                                                <iframe
                                                    src={`${selectedQuestion.file_url}#toolbar=0`}
                                                    className="w-full h-full border-none"
                                                    title="Question Preview"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-10 text-center">
                                                    <AlertCircle size={48} className="mb-4 opacity-20" />
                                                    <p className="font-bold">Preview not available</p>
                                                    <p className="text-xs">This question might only be available for download.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Sidebar Details */}
                                    <div className="w-80 border-l border-border p-8 space-y-8 bg-card overflow-y-auto">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actions</h4>
                                            <button
                                                onClick={() => selectedQuestion && handleDownload(selectedQuestion.id, selectedQuestion.file_url || '')}
                                                disabled={!selectedQuestion?.file_url || downloadingId === selectedQuestion?.id}
                                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                {downloadingId === selectedQuestion?.id ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={20} />
                                                        Downloading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download size={20} />
                                                        Download PDF
                                                    </>
                                                )}
                                            </button>
                                            <button className="w-full bg-muted border border-border hover:bg-muted/80 text-foreground py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3">
                                                <Maximize2 size={20} />
                                                Open Fullscreen
                                            </button>
                                        </div>

                                        <div className="space-y-6 pt-6 border-t border-border">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Document Info</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center px-4 py-3 bg-muted/50 rounded-xl">
                                                    <span className="text-xs text-muted-foreground">File Size</span>
                                                    <span className="text-xs font-bold">{formatFileSize(selectedQuestion.file_size)}</span>
                                                </div>
                                                <div className="flex justify-between items-center px-4 py-3 bg-muted/50 rounded-xl">
                                                    <span className="text-xs text-muted-foreground">Total Pages</span>
                                                    <span className="text-xs font-bold">{selectedQuestion.pages} Pages</span>
                                                </div>
                                                <div className="flex justify-between items-center px-4 py-3 bg-muted/50 rounded-xl">
                                                    <span className="text-xs text-muted-foreground">Downloads</span>
                                                    <span className="text-xs font-bold">{selectedQuestion.download_count} times</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Exam Tip Card */}
                                        <div className="p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl">
                                            <h5 className="text-sm font-bold mb-2 flex items-center gap-2">
                                                <Info size={16} className="text-blue-500" />
                                                Study Tip
                                            </h5>
                                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                                                Focus on years 2021-2023 for the most current syllabus alignment.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                                <AlertCircle size={48} className="text-red-500" />
                                <div className="text-center">
                                    <h3 className="text-xl font-bold">Question Not Found</h3>
                                    <p className="text-muted-foreground text-sm">This resource may have been removed.</p>
                                </div>
                                <button onClick={closeDetails} className="bg-muted border border-border px-6 py-2 rounded-xl text-xs font-bold">
                                    Back to Library
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BrowsePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        }>
            <BrowseContent />
        </Suspense>
    );
}
