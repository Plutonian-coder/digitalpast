"use client";

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
    ExternalLink
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function QuestionDetailsPage({ params }: { params: { id: string } }) {
    // Mock data for a single question
    const question = {
        code: "COM 311",
        title: "Operating Systems II",
        type: "Theory",
        session: "2022/2023",
        semester: "2nd Semester",
        level: "ND 2",
        school: "School of Technology",
        department: "Computer Science",
        size: "2.4 MB",
        pages: 12,
        uploadedAt: "Oct 12, 2023"
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Breadcrumbs & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <Link href="/browse" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                        <div className="p-2 bg-muted border border-border rounded-xl group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-sm font-bold">Back to Browse</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 transition-all">
                            <Share2 size={16} />
                            Share
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 transition-all">
                            <Bookmark size={16} />
                            Save to Library
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 transition-all">
                            <Download size={16} />
                            Download PDF ({question.size})
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content: Metadata & Preview */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-blue-600 text-[10px] font-bold rounded-lg text-white">
                                    {question.code}
                                </span>
                                <span className="px-4 py-1.5 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase">
                                    {question.type}
                                </span>
                                <span className="px-4 py-1.5 bg-muted border border-border text-[10px] font-bold rounded-lg text-muted-foreground uppercase tracking-widest leading-normal">
                                    PDF AVAILABLE
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">{question.title}</h1>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-border">
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
                                    <p className="text-sm font-bold flex items-center gap-2"><FileText size={14} className="text-blue-500" /> {question.pages} Pages</p>
                                </div>
                            </div>

                            {/* PDF Preview Placeholder */}
                            <div className="mt-10 bg-muted/30 border border-border rounded-3xl h-[600px] flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
                                <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform ring-1 ring-blue-500/20">
                                    <FileText size={40} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-2">PDF Document Preview</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">Full preview is available for verified students. Download for offline viewing.</p>
                                </div>
                                <button className="flex items-center gap-3 bg-foreground text-background px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:bg-foreground/90 transition-all active:scale-95">
                                    <ExternalLink size={18} />
                                    Open Full Preview
                                </button>
                            </div>
                        </div>

                        {/* Discussion / Report Section */}
                        <div className="bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <AlertCircle className="w-6 h-6 text-orange-500/50" />
                                <div>
                                    <h5 className="text-sm font-bold text-foreground">Notice an issue?</h5>
                                    <p className="text-xs">Report discrepancies in this question paper to the archive admin.</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold bg-muted border border-border px-6 py-3 rounded-xl hover:bg-muted/80 transition-all">Report Concern</button>
                        </div>
                    </div>

                    {/* Sidebar: Details & Related */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border rounded-3xl p-8 space-y-8">
                            <h3 className="text-xl font-bold">Document Info</h3>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">School</p>
                                    <p className="text-sm font-bold">{question.school}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Department</p>
                                    <p className="text-sm font-bold">{question.department}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Uploaded On</p>
                                    <p className="text-sm font-bold text-muted-foreground">{question.uploadedAt}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold px-1">Related Questions</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Link key={i} href="#" className="block p-5 bg-card border border-border rounded-2xl hover:bg-muted transition-all group">
                                        <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-blue-400">COM 31{i}</p>
                                        <h4 className="text-sm font-bold text-foreground mb-2 leading-relaxed">Discrete Mathematics for Computing</h4>
                                        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-tight">2021/2022 • 1ST SEMESTER</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
