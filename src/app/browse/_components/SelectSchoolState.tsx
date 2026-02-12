import React from 'react';
import { School, ArrowLeft } from "lucide-react";

export function SelectSchoolState() {
    return (
        <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center justify-center">
            {/* Center Content */}
            <div className="max-w-md w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-32 h-32 bg-primary/5 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <div className="absolute w-full h-full rounded-full border border-primary/20 dark:border-primary/20 animate-ping opacity-25"></div>
                    <School className="w-16 h-16 text-primary dark:text-primary" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Welcome to the Portal</h1>
                    <p className="text-muted-foreground text-lg">Select a school from the sidebar to begin browsing past questions and materials.</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-primary font-medium text-sm pt-4 opacity-80 animate-pulse">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Start over there</span>
                </div>
            </div>

            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-30 dark:opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
        </div>
    );
}
