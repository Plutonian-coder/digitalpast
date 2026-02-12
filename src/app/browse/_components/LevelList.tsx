import React from 'react';
import { ArrowLeft, ChevronRight, School } from "lucide-react";

interface LevelListProps {
    schoolName: string;
    departmentName: string;
    levels: string[];
    onSelect: (level: string) => void;
    onBack: () => void;
}

export function LevelList({ schoolName, departmentName, levels, onSelect, onBack }: LevelListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-4 duration-500">
                <nav className="flex items-center">
                    <span className="flex items-center gap-1">
                        <School className="w-4 h-4" />
                        {schoolName}
                    </span>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-medium text-foreground">{departmentName}</span>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-primary">Levels</span>
                </nav>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-in fade-in duration-700 delay-100">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Select Level</h1>
                    <p className="text-muted-foreground mt-2">
                        Choose a level within <span className="font-semibold text-primary">{departmentName}</span> to view past questions.
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground bg-card hover:bg-muted transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Departments
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {levels.map((level, index) => {
                    const isND = level.startsWith("ND");
                    // Changed ND (Blue) to Black/Primary
                    const colorClass = isND
                        ? "bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                        : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white";

                    const programType = isND ? "Diploma" : "Higher Diploma";

                    return (
                        <button
                            key={level}
                            onClick={() => onSelect(level)}
                            className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary transition-all duration-300 flex flex-col justify-between h-48 text-left w-full"
                        >
                            <div className="flex justify-between items-start w-full">
                                <div className={`font-bold text-xs px-2.5 py-1 rounded uppercase tracking-wide transition-colors ${colorClass}`}>
                                    {programType}
                                </div>
                                <ArrowLeft className="rotate-180 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{level}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {level.includes("1") ? "Year 1" : "Year 2"}
                                </p>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-muted h-1 mt-4 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${isND ? 'bg-primary w-3/4' : 'bg-purple-500 w-1/2'}`}></div>
                            </div>

                            <div className="text-xs text-muted-foreground mt-2 flex justify-between w-full">
                                <span>View Available Courses</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
