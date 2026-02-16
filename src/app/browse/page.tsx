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
import { SelectSchoolState } from "./_components/SelectSchoolState";
import { DepartmentList } from "./_components/DepartmentList";
import { LevelList } from "./_components/LevelList";
import { CourseList } from "./_components/CourseList";
import { PastQuestionList } from "./_components/PastQuestionList";
import { SearchResults } from "./_components/SearchResults";


function BrowseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for Drill-Down
    type Step = 'initial' | 'departments' | 'levels' | 'courses' | 'questions';
    const [step, setStep] = useState<Step>('initial');

    // Selection State
    const [selectedSchool, setSelectedSchool] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [selectedCourse, setSelectedCourse] = useState<{ course_code: string, course_title: string } | null>(null);
    const [selectedSession, setSelectedSession] = useState<string>("");

    // Data State
    const [schools, setSchools] = useState<School[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [courses, setCourses] = useState<{ course_code: string, course_title: string, file_count: number }[]>([]);
    const [questions, setQuestions] = useState<PastQuestion[]>([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchResults, setSearchResults] = useState<PastQuestion[]>([]);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<PastQuestion | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Save/Download state
    const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);

    // Mobile filter state
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const filters = {
        levels: ["ND 1", "ND 2", "HND 1", "HND 2"],
    };

    const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Search Effect
    useEffect(() => {
        if (debouncedSearch) {
            fetchSearchResults(debouncedSearch);
        }
    }, [debouncedSearch]);

    // Initial Data Fetch
    useEffect(() => {
        fetchSchools();
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

    // FETCHING FUNCTIONS

    async function fetchSchools() {
        try {
            const { data } = await supabase.from('schools').select('*').order('name');
            setSchools(data || []);
        } catch (err) {
            console.error("Failed to fetch schools", err);
        }
    }

    async function fetchDepartments(schoolId: string) {
        if (!schoolId) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('departments')
                .select('*')
                .eq('school_id', schoolId)
                .order('name');
            setDepartments(data || []);
        } catch (err) {
            console.error("Failed to fetch departments", err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCourses(deptId: string, lvl: string) {
        if (!deptId || !lvl) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('past_questions')
                .select('course_code, course_title')
                .eq('department_id', deptId)
                .eq('level', lvl);

            if (data) {
                // Aggregate counts
                const courseMap = new Map<string, { course_code: string, course_title: string, file_count: number }>();
                data.forEach(item => {
                    const key = item.course_code;
                    if (!courseMap.has(key)) {
                        courseMap.set(key, { ...item, file_count: 0 });
                    }
                    courseMap.get(key)!.file_count++;
                });
                setCourses(Array.from(courseMap.values()));
            }
        } catch (err) {
            console.error("Failed to fetch courses", err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchQuestions(courseCode: string) {
        if (!courseCode) return;
        setLoading(true);
        try {
            let query = supabase
                .from('past_questions')
                .select('*')
                .eq('course_code', courseCode);

            if (selectedSession) query = query.eq('session', selectedSession);
            if (sortBy === "newest") {
                query = query.order('created_at', { ascending: false });
            } else {
                query = query.order('download_count', { ascending: false });
            }

            const { data, error } = await query;
            if (error) throw error;
            setQuestions(data || []);
        } catch (err) {
            console.error("Failed to fetch questions", err);
            setError("Failed to load questions.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchSearchResults(queryTerm: string) {
        if (!queryTerm) {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            const searchTerm = `%${queryTerm}%`;
            const { data, error } = await supabase
                .from('past_questions')
                .select('*')
                .or(`course_code.ilike.${searchTerm},course_title.ilike.${searchTerm}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSearchResults(data || []);
        } catch (err) {
            console.error("Failed to search questions", err);
        } finally {
            setLoading(false);
        }
    }

    // HANDLERS

    const handleSelectSchool = (schoolId: string) => {
        setSelectedSchool(schoolId);
        // Reset children
        setSelectedDepartment("");
        setSelectedLevel("");
        setSelectedCourse(null);

        if (schoolId) {
            fetchDepartments(schoolId);
            setStep('departments');
        } else {
            setStep('initial');
        }
    };

    const handleSelectDepartment = (deptId: string) => {
        setSelectedDepartment(deptId);
        // Reset children
        setSelectedLevel("");
        setSelectedCourse(null);

        if (deptId) {
            setStep('levels');
        } else {
            setStep('departments');
        }
    };

    const handleSelectLevel = (lvl: string) => {
        setSelectedLevel(lvl);
        // Reset children
        setSelectedCourse(null);

        if (lvl) {
            fetchCourses(selectedDepartment, lvl);
            setStep('courses');
        } else {
            setStep('levels');
        }
    };

    const handleSelectCourse = (course: { course_code: string, course_title: string }) => {
        setSelectedCourse(course);
        if (course) {
            fetchQuestions(course.course_code);
            setStep('questions');
        } else {
            setStep('courses');
        }
    };

    // Navigation Back
    const handleBack = () => {
        if (step === 'questions') {
            setStep('courses');
            setSelectedCourse(null);
        } else if (step === 'courses') {
            setStep('levels');
            setSelectedLevel("");
        } else if (step === 'levels') {
            setStep('departments');
            setSelectedDepartment("");
        } else if (step === 'departments') {
            setStep('initial');
            setSelectedSchool("");
        }
    };

    // Existing Modal logic...
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

    const handleDownload = async (questionId: string, fileUrl: string) => {
        if (!fileUrl) return;

        setDownloadingId(questionId);

        try {
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

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('download_history')
                    .insert({ user_id: user.id, question_id: questionId });
            }

            window.open(fileUrl, '_blank');
            if (step === 'questions' && selectedCourse) {
                fetchQuestions(selectedCourse.course_code);
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

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
                await supabase.from('saved_questions').delete().eq('user_id', user.id).eq('question_id', questionId);
                setSavedQuestions(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(questionId);
                    return newSet;
                });
            } else {
                await supabase.from('saved_questions').insert({ user_id: user.id, question_id: questionId });
                setSavedQuestions(prev => new Set(prev).add(questionId));
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save. Please try again.');
        } finally {
            setSavingId(null);
        }
    };

    const currentSchoolName = schools.find(s => s.id === selectedSchool)?.name || "Selected School";
    const currentDeptName = departments.find(d => d.id === selectedDepartment)?.name || "Selected Department";
    const currentCourse = selectedCourse;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground w-full">
            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                aria-label="Open filters"
            >
                <Filter size={24} />
            </button>

            {/* Mobile Overlay */}
            {showMobileFilters && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setShowMobileFilters(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-full sm:w-80 border-r border-border flex flex-col bg-card overflow-y-auto transition-transform duration-300 ease-in-out",
                "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto h-full lg:h-auto",
                showMobileFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-6 lg:p-8 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                    <h2 className="text-lg lg:text-xl font-bold flex items-center gap-2">
                        <Filter className="w-5 h-5 text-primary" />
                        Filter Results
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleSelectSchool("")}
                            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 lg:p-8 space-y-8 lg:space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">School</label>
                        <div className="relative">
                            <select
                                value={selectedSchool}
                                onChange={(e) => handleSelectSchool(e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer text-foreground"
                            >
                                <option value="">All Schools</option>
                                {schools.map(s => <option key={s.id} value={s.id} className="bg-background">{s.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    <div className={cn("space-y-4 transition-opacity duration-300", !selectedSchool && "opacity-50 pointer-events-none")}>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Department</label>
                        <div className="relative">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => handleSelectDepartment(e.target.value)}
                                disabled={!selectedSchool}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer text-foreground disabled:opacity-50"
                            >
                                <option value="">All Departments</option>
                                {departments
                                    .filter(d => !selectedSchool || d.school_id === selectedSchool)
                                    .map(d => <option key={d.id} value={d.id} className="bg-background">{d.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    <div className={cn("space-y-4 transition-opacity duration-300", !selectedDepartment && "opacity-50 pointer-events-none")}>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Level</label>
                        <div className="grid grid-cols-2 gap-2">
                            {filters.levels.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => handleSelectLevel(level)}
                                    disabled={!selectedDepartment}
                                    className={cn(
                                        "py-2.5 rounded-xl text-xs font-bold border transition-all",
                                        selectedLevel === level
                                            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-black/10"
                                            : "bg-muted border-border text-muted-foreground hover:border-foreground/20"
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Session Year</label>
                        <div className="relative">
                            <select
                                value={selectedSession}
                                onChange={(e) => setSelectedSession(e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-2xl py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer text-foreground"
                            >
                                <option value="">All Years</option>
                                <option className="bg-background">2026/2027</option>
                                <option className="bg-background">2025/2026</option>
                                <option className="bg-background">2024/2025</option>
                                <option className="bg-background">2023/2024</option>
                                <option className="bg-background">2022/2023</option>
                                <option className="bg-background">2021/2022</option>
                                <option className="bg-background">2020/2021</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span>Step Progress</span>
                            <span>{['initial', 'departments', 'levels', 'courses', 'questions'].indexOf(step) + 1} / 5</span>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${((['initial', 'departments', 'levels', 'courses', 'questions'].indexOf(step) + 1) / 5) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-background w-full overflow-x-hidden">
                <header className="min-h-[80px] border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-6 lg:px-10 py-4 sm:py-0 bg-background/50 backdrop-blur-xl gap-4 sm:gap-0 sticky top-0 z-30">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by course code, title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-foreground"
                        />
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6">
                        <span className="text-sm font-medium text-muted-foreground">{selectedLevel || "All Levels"}</span>
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 ring-2 ring-border" />
                    </div>
                </header>

                <div className="flex-1 relative h-full">
                    {debouncedSearch ? (
                        <SearchResults
                            results={searchResults}
                            loading={loading}
                            query={debouncedSearch}
                            onSelectQuestion={(q) => { setSelectedQuestion(q); setIsModalOpen(true); }}
                            onSaveToggle={handleSaveToggle}
                            savedQuestions={savedQuestions}
                            savingId={savingId}
                        />
                    ) : (
                        <>
                            {step === 'initial' && <SelectSchoolState />}
                            {step === 'departments' && (
                                <DepartmentList
                                    schoolName={currentSchoolName}
                                    departments={departments}
                                    onSelect={(d) => handleSelectDepartment(d.id)}
                                    onBack={handleBack}
                                    loading={loading}
                                />
                            )}
                            {step === 'levels' && (
                                <LevelList
                                    schoolName={currentSchoolName}
                                    departmentName={currentDeptName}
                                    levels={filters.levels}
                                    onSelect={handleSelectLevel}
                                    onBack={handleBack}
                                />
                            )}
                            {step === 'courses' && (
                                <CourseList
                                    schoolName={currentSchoolName}
                                    departmentName={currentDeptName}
                                    level={selectedLevel}
                                    courses={courses}
                                    onSelect={handleSelectCourse}
                                    onBack={handleBack}
                                    loading={loading}
                                />
                            )}
                            {step === 'questions' && (
                                <PastQuestionList
                                    courseTitle={currentCourse?.course_title || "Unknown Course"}
                                    courseCode={currentCourse?.course_code || ""}
                                    schoolName={currentSchoolName}
                                    departmentName={currentDeptName}
                                    level={selectedLevel}
                                    questions={questions}
                                    loading={loading}
                                    onBack={handleBack}
                                    onSelectQuestion={(q) => { setSelectedQuestion(q); setIsModalOpen(true); }}
                                    onSaveToggle={handleSaveToggle}
                                    savedQuestions={savedQuestions}
                                    savingId={savingId}
                                />
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && selectedQuestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeDetails} />
                    <div className={cn(
                        "relative bg-card border border-border  shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300",
                        isFullScreen ? "fixed inset-0 w-full h-full rounded-none z-[60]" : "w-full max-w-6xl h-full rounded-[2.5rem]"
                    )}>
                        <div className="p-8 border-b border-border flex justify-between items-start">
                            <div className="flex gap-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary ring-1 ring-primary/20">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        <span className="px-3 py-1 bg-primary text-[10px] font-bold rounded-lg text-primary-foreground uppercase">{selectedQuestion.course_code}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground">{selectedQuestion.course_title}</h2>
                                    <p className="text-muted-foreground text-sm font-medium">{selectedQuestion.session} • {selectedQuestion.semester}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                    className="p-3 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors"
                                    title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                                >
                                    <Maximize2 size={20} />
                                </button>
                                <button onClick={closeDetails} className="p-3 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors"><X size={20} /></button>
                            </div>
                        </div>
                        <div className="flex-1 flex overflow-hidden">
                            <div className="flex-1 bg-muted/30 p-8">
                                <div className="bg-white rounded-3xl overflow-hidden shadow-inner border border-border h-full relative">
                                    {selectedQuestion.file_url ? (
                                        <iframe src={`${selectedQuestion.file_url}#toolbar=0`} className="w-full h-full border-none" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground"><p>N/A</p></div>
                                    )}
                                </div>
                            </div>
                            {!isFullScreen && (
                                <div className="w-80 border-l border-border p-8 bg-card overflow-y-auto space-y-4">
                                    <button
                                        onClick={() => handleDownload(selectedQuestion.id, selectedQuestion.file_url || '')}
                                        disabled={!selectedQuestion.file_url}
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-2xl font-bold flex justify-center items-center gap-2"
                                    >
                                        {downloadingId === selectedQuestion.id ? <Loader2 className="animate-spin" /> : <Download />} Download PDF
                                    </button>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span>Size</span><span className="font-bold">{formatFileSize(selectedQuestion.file_size)}</span></div>
                                        <div className="flex justify-between"><span>Pages</span><span className="font-bold">{selectedQuestion.pages}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BrowsePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
            <BrowseContent />
        </Suspense>
    );
}
