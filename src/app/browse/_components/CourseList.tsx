import React from 'react';
import { ArrowLeft, ChevronRight, BookOpen, FileText } from "lucide-react";

interface Course {
    course_code: string;
    course_title: string;
    file_count: number;
}

interface CourseListProps {
    schoolName: string;
    departmentName: string;
    level: string;
    courses: Course[];
    onSelect: (course: Course) => void;
    onBack: () => void;
    loading?: boolean;
}

export function CourseList({ schoolName, departmentName, level, courses, onSelect, onBack, loading }: CourseListProps) {
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-10 h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div className="space-y-4">
                    <nav className="flex items-center text-sm text-muted-foreground">
                        <span className="hover:text-primary transition-colors cursor-pointer" onClick={onBack}>{schoolName}</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="hover:text-primary transition-colors cursor-pointer" onClick={onBack}>{departmentName}</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{level}</span>
                    </nav>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Courses in {level}</h1>
                        <p className="text-muted-foreground text-sm">Showing {courses.length} courses found available for this level</p>
                    </div>
                </div>
                <div className="self-start md:self-end">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground bg-card hover:bg-muted transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Levels
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {courses.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        No courses found for this criteria.
                    </div>
                ) : courses.map((course, index) => (
                    <button
                        key={course.course_code + index}
                        onClick={() => onSelect(course)}
                        className="group bg-card hover:bg-muted/50 rounded-2xl border border-border p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden text-left w-full h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="w-full">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-primary/5 dark:bg-primary/20 text-primary font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wide">
                                    {course.course_code}
                                </span>
                                <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>

                            <h3 className="text-lg font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                {course.course_title}
                            </h3>
                        </div>

                        <div className="w-full pt-4 border-t border-border flex justify-between items-center mt-auto">
                            <div className="flex items-center gap-2 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                <FileText className="w-3 h-3" />
                                {course.file_count} Files
                            </div>
                            <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                                View Details
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
