"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    User as UserIcon,
    Moon,
    Sun,
    Bell,
    Shield,
    Camera,
    ChevronRight,
    Monitor,
    Loader2,
    CheckCircle2,
    AlertCircle,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { auth, supabase, type User, type Department } from "@/lib/supabase";

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [user, setUser] = useState<User | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

    const [formData, setFormData] = useState({
        full_name: "",
        matric_number: "",
        department_id: "",
        level: ""
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    async function fetchInitialData() {
        try {
            setLoading(true);
            const { user: authUser } = await auth.getCurrentUser();

            if (!authUser) {
                router.push('/login');
                return;
            }

            // Fetch profile
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile) {
                setUser(profile);
                setFormData({
                    full_name: profile.full_name || "",
                    matric_number: profile.matric_number || "",
                    department_id: profile.department_id || "",
                    level: profile.level || ""
                });
            }

            // Fetch departments
            const { data: deps } = await supabase
                .from('departments')
                .select('*')
                .order('name');

            setDepartments(deps || []);
        } catch (err) {
            console.error("Error fetching settings data:", err);
            setError("Failed to load user profile");
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        if (!user) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const { error: updateError } = await supabase
                .from('users')
                .update({
                    full_name: formData.full_name,
                    matric_number: formData.matric_number || null,
                    department_id: formData.department_id || null,
                    level: formData.level || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setSuccess("Profile updated successfully!");
            // Refresh user state
            setUser({ ...user, ...formData } as User);
        } catch (err: any) {
            console.error("Error updating profile:", err);
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const initials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : "??";

    const levels = ["ND 1", "ND 2", "HND 1", "HND 2"];

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 selection:bg-blue-500/30">
            <div className="max-w-4xl mx-auto relative">
                <div className="absolute top-0 right-0 flex items-center gap-4">
                    <ModeToggle />
                </div>
                <h1 className="text-4xl font-bold mb-10 text-foreground">Account Settings</h1>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-500 text-sm font-medium">
                        <CheckCircle2 size={20} />
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className="space-y-10">
                    {/* Profile Section */}
                    <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Profile Information</h3>
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10">
                            <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
                                <div className="relative group">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] flex items-center justify-center text-3xl font-bold ring-4 ring-white/10 text-white">
                                        {initials}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-700 transition-all border-4 border-background">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <h4 className="text-2xl font-bold">{user?.full_name}</h4>
                                    <p className="text-muted-foreground text-sm">Matric No: {user?.matric_number || "Not set"}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1 font-bold">
                                        <span className="text-blue-500 text-xs uppercase tracking-wide">
                                            {departments.find(d => d.id === user?.department_id)?.name || "No Department"}
                                        </span>
                                        <span className="text-muted-foreground text-xs">•</span>
                                        <span className="text-blue-500 text-xs uppercase tracking-wide">
                                            {user?.level || "No Level"}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-bold text-sm transition-all"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-foreground"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full bg-muted/20 border border-border rounded-2xl py-3.5 px-4 text-sm text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Matric Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., F/ND/23/..."
                                        value={formData.matric_number}
                                        onChange={(e) => setFormData({ ...formData, matric_number: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-foreground"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Department</label>
                                        <select
                                            value={formData.department_id}
                                            onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-foreground"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dep => (
                                                <option key={dep.id} value={dep.id} className="bg-background">{dep.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Level</label>
                                        <select
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-foreground"
                                        >
                                            <option value="">Select Level</option>
                                            {levels.map(l => (
                                                <option key={l} value={l} className="bg-background">{l}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Appearance</h3>
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: "light", label: "Light Mode", icon: Sun },
                                    { id: "dark", label: "Dark Mode", icon: Moon },
                                    { id: "system", label: "System", icon: Monitor },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setTheme(option.id as any)}
                                        className={cn(
                                            "p-6 rounded-[2rem] border transition-all text-center flex flex-col items-center gap-4 group",
                                            theme === option.id
                                                ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-900/20"
                                                : "bg-muted/50 border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-2xl transition-all",
                                            theme === option.id ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                                        )}>
                                            <option.icon size={24} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest leading-none">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Security & Notifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <section className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Security</h3>
                            <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-muted rounded-2xl transition-all">
                                    <div className="flex items-center gap-4">
                                        <Shield className="text-blue-500" size={20} />
                                        <span className="text-sm font-bold text-foreground">Change Password</span>
                                    </div>
                                    <ChevronRight size={16} className="text-muted-foreground" />
                                </button>
                                <div className="p-4 border-t border-border flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div className="flex items-center gap-4">
                                        <Shield className="text-muted-foreground" size={20} />
                                        <span className="text-sm font-bold text-muted-foreground">Two-Factor Auth</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded">COMING SOON</span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Notifications</h3>
                            <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <Bell className="text-blue-500" size={20} />
                                        <span className="text-sm font-bold text-foreground">New Resources</span>
                                    </div>
                                    <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1 cursor-pointer">
                                        <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border-t border-border">
                                    <div className="flex items-center gap-4">
                                        <Bell className="text-muted-foreground" size={20} />
                                        <span className="text-sm font-bold text-foreground">Exam Reminders</span>
                                    </div>
                                    <div className="w-10 h-5 bg-muted rounded-full flex items-center px-1 cursor-pointer">
                                        <div className="w-3 h-3 bg-white/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
