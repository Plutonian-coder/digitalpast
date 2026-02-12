import React from 'react';
import {
    Monitor,
    Microscope,
    Dna,
    BarChart,
    Atom,
    FlaskConical,
    Utensils,
    DraftingCompass,
    School,
    ArrowLeft,
    Info,
    ChevronRight,
    Building2
} from "lucide-react";
import { Department } from "@/lib/supabase";

interface DepartmentListProps {
    schoolName: string;
    departments: Department[];
    onSelect: (dept: Department) => void;
    onBack: () => void;
    loading?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
    "Computer Science": Monitor,
    "Microbiology": Microscope,
    "Biochemistry": Dna,
    "Statistics": BarChart,
    "Mathematics": BarChart,
    "Physics": Atom,
    "Chemistry": FlaskConical,
    "Food Technology": Utensils,
    "Architecture": DraftingCompass,
    "Civil Engineering": Building2,
    "Electrical Engineering": Atom,
    "Mechanical Engineering": DraftingCompass,
};

export function DepartmentList({ schoolName, departments, onSelect, onBack, loading }: DepartmentListProps) {
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Updated colors array replacing Blue with Black/Neutral
    const colors = [
        "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground", // Was Blue
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
        "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white",
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white",
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white",
        "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white",
        "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white",
    ];

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <nav className="flex items-center text-sm text-muted-foreground mb-2">
                        <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
                            <School className="w-4 h-4" />
                            Schools
                        </button>
                        <span className="mx-2 text-muted-foreground/50">/</span>
                        <span className="font-medium text-foreground">{schoolName}</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-foreground">Departments in {schoolName}</h1>
                    <p className="text-sm text-muted-foreground mt-1">Select a department to view available courses and past questions.</p>
                </div>
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground bg-card hover:bg-muted transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Schools
                </button>
            </div>

            {/* Info Banner - Neutralized */}
            <div className="mb-8 p-4 bg-muted border border-border rounded-xl flex items-start gap-3 animate-in fade-in duration-700 delay-100">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-foreground">Selection Required</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Please choose your department to filter the past questions specifically for your program.</p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {departments.map((dept, index) => {
                    const Icon = iconMap[dept.name] || Building2; // Default icon
                    const colorClass = colors[index % colors.length];

                    return (
                        <button
                            key={dept.id}
                            onClick={() => onSelect(dept)}
                            className="group bg-card border border-border rounded-xl p-5 hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex items-center justify-between text-left w-full"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${colorClass}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-base line-clamp-1">{dept.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{dept.code}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
