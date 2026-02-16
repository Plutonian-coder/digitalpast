"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    Plus,
    ChevronDown,
    Info,
    ShieldCheck,
    Loader2,
    AlertCircle
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { supabase, type School, type Department } from "@/lib/supabase";

export default function AdminUploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [schools, setSchools] = useState<School[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [formData, setFormData] = useState({
        courseCode: "",
        courseTitle: "",
        departmentId: "",
        academicYear: "",
        semester: "",
        level: "",
        questionType: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            // Check auth
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push('/login');
                return;
            }

            // Check if user has admin role
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', authUser.id)
                .single();

            if (userError || !userData || userData.role !== 'admin') {
                alert('Access denied. Only administrators can upload questions.');
                router.push('/dashboard');
                return;
            }

            const { data: schoolsData } = await supabase.from("schools").select("*").order("name");
            const { data: depsData } = await supabase.from("departments").select("*").order("name");
            setSchools(schoolsData || []);
            setDepartments(depsData || []);
        };
        fetchData();
    }, [router]);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);

        try {
            // 1. Upload File to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('questions')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('questions')
                .getPublicUrl(filePath);

            // 2. Insert Metadata into Database
            const { error: dbError } = await supabase
                .from('past_questions')
                .insert({
                    course_code: formData.courseCode,
                    course_title: formData.courseTitle,
                    department_id: formData.departmentId,
                    level: formData.level,
                    session: formData.academicYear,
                    semester: formData.semester,
                    question_type: formData.questionType,
                    file_url: publicUrl,
                    file_size: file.size,
                    pages: 1, // Default or could be extracted
                    uploaded_by: (await supabase.auth.getUser()).data.user?.id
                });

            if (dbError) throw dbError;

            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 selection:bg-blue-500/30">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 ring-1 ring-blue-500/20">
                            <Upload size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Admin Upload</h1>
                            <p className="text-muted-foreground text-sm">Add new questions to the repository</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <ShieldCheck size={14} className="text-blue-500" />
                            Admin Authorized
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Main Form: Metadata */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 space-y-8">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
                                <Info size={20} className="text-blue-500" />
                                Resource Metadata
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Course Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., COM 311"
                                        value={formData.courseCode}
                                        onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-foreground"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Course Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Operating Systems II"
                                        value={formData.courseTitle}
                                        onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">School</label>
                                    <div className="relative">
                                        <select
                                            value={selectedSchool}
                                            onChange={(e) => {
                                                setSelectedSchool(e.target.value);
                                                setFormData({ ...formData, departmentId: "" });
                                            }}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground"
                                        >
                                            <option value="">Select School</option>
                                            {schools.map(school => (
                                                <option key={school.id} value={school.id} className="bg-background">{school.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Department</label>
                                    <div className="relative">
                                        <select
                                            value={formData.departmentId}
                                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                            disabled={!selectedSchool}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground disabled:opacity-50"
                                        >
                                            <option value="">Select Department</option>
                                            {departments
                                                .filter(d => d.school_id === selectedSchool)
                                                .map(dep => (
                                                    <option key={dep.id} value={dep.id} className="bg-background">{dep.name}</option>
                                                ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Academic Year</label>
                                    <div className="relative">
                                        <select
                                            value={formData.academicYear}
                                            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground"
                                        >
                                            <option value="">Select Year</option>
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
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Semester</label>
                                    <div className="relative">
                                        <select
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground"
                                        >
                                            <option value="">Select Semester</option>
                                            <option className="bg-background">1st Semester</option>
                                            <option className="bg-background">2nd Semester</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Level</label>
                                    <div className="relative">
                                        <select
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground"
                                        >
                                            <option value="">Select Level</option>
                                            <option className="bg-background">ND 1</option>
                                            <option className="bg-background">ND 2</option>
                                            <option className="bg-background">HND 1</option>
                                            <option className="bg-background">HND 2</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Question Type</label>
                                    <div className="relative">
                                        <select
                                            value={formData.questionType}
                                            onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-foreground"
                                        >
                                            <option value="">Select Type</option>
                                            <option className="bg-background">Theory</option>
                                            <option className="bg-background">Practical</option>
                                            <option className="bg-background">Assignment</option>
                                            <option className="bg-background">Lab</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: File Upload */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-8 h-full flex flex-col">
                            <h3 className="text-xl font-bold text-foreground">Document Source</h3>

                            {!success ? (
                                <div className="flex-1 flex flex-col space-y-6">
                                    <div className="flex-1 min-h-[300px] bg-muted/30 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center group hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                            <Upload size={32} />
                                        </div>
                                        <div className="space-y-2 relative z-10">
                                            <h4 className="font-bold text-foreground">Drop PDF here</h4>
                                            <p className="text-muted-foreground text-xs">Maximum file size: 25MB</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </div>

                                    {file && (
                                        <div className="p-4 bg-muted border border-border rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <FileText className="text-blue-500 flex-shrink-0" />
                                                <div className="truncate">
                                                    <p className="text-sm font-bold truncate text-foreground">{file.name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setFile(null)} className="p-2 hover:text-red-500 transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        disabled={!file || uploading}
                                        onClick={handleUpload}
                                        className="w-full bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Uploading & Indexing...
                                            </>
                                        ) : (
                                            <>
                                                Upload Question Archive
                                                <Plus size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 ring-4 ring-green-500/10">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2 text-foreground">Upload Complete</h3>
                                        <p className="text-muted-foreground text-sm">Resource has been indexed and published.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSuccess(false);
                                            setFile(null);
                                            setFormData({
                                                courseCode: "",
                                                courseTitle: "",
                                                departmentId: "",
                                                academicYear: "",
                                                semester: "",
                                                level: "",
                                                questionType: ""
                                            });
                                        }}
                                        className="bg-muted border border-border hover:bg-muted/80 px-8 py-3 rounded-2xl text-xs font-bold transition-all text-foreground"
                                    >
                                        Upload Another
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
