import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("Supabase Client Init Check:", {
    url: supabaseUrl ? "Found" : "MISSING",
    key: supabaseAnonKey ? "Found (First 10): " + supabaseAnonKey.substring(0, 10) : "MISSING"
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase environment variables are missing! Please restart 'npm run dev' to load .env.local changes.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
    // Sign up new user
    signUp: async (email: string, password: string, metadata: {
        full_name: string
        matric_number?: string
    }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
                // Disable email confirmation for development
                emailRedirectTo: undefined
            }
        })
        return { data, error }
    },

    // Sign in existing user
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Get current user
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    },

    // Get current session
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        return { session, error }
    },

    // Listen to auth changes
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback)
    }
}

// Database types
export type School = {
    id: string
    name: string
    slug: string
    description: string | null
    created_at: string
}

export type Department = {
    id: string
    school_id: string
    name: string
    code: string
    created_at: string
}

export type User = {
    id: string
    matric_number: string | null
    full_name: string
    email: string
    department_id: string | null
    level: string | null
    role: string
    created_at: string
    updated_at: string
}

export type PastQuestion = {
    id: string
    course_code: string
    course_title: string
    department_id: string
    level: string
    session: string
    semester: string
    question_type: string
    file_url: string | null
    file_size: number | null
    pages: number | null
    uploaded_by: string | null
    download_count: number
    created_at: string
    updated_at: string
}

export type SavedQuestion = {
    id: string
    user_id: string
    question_id: string
    created_at: string
}

export type DownloadHistory = {
    id: string
    user_id: string
    question_id: string
    downloaded_at: string
}
