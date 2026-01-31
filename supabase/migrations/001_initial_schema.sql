-- Digital Past Question Platform - Initial Database Schema
-- Migration: 001_initial_schema
-- Created: 2026-01-31

-- ============================================
-- TABLES
-- ============================================

-- Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  matric_number TEXT UNIQUE,
  department_id UUID REFERENCES departments(id),
  level TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Past Questions Table
CREATE TABLE IF NOT EXISTS past_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  level TEXT NOT NULL CHECK (level IN ('ND 1', 'ND 2', 'HND 1', 'HND 2')),
  session TEXT NOT NULL,
  semester TEXT NOT NULL CHECK (semester IN ('1st Semester', '2nd Semester')),
  question_type TEXT NOT NULL CHECK (question_type IN ('Theory', 'Practical', 'Assignment', 'Lab')),
  file_url TEXT,
  file_size BIGINT,
  pages INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES auth.users(id),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Questions Table
CREATE TABLE IF NOT EXISTS saved_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES past_questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Download History Table
CREATE TABLE IF NOT EXISTS download_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES past_questions(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_departments_school ON departments(school_id);
CREATE INDEX IF NOT EXISTS idx_past_questions_department ON past_questions(department_id);
CREATE INDEX IF NOT EXISTS idx_past_questions_level ON past_questions(level);
CREATE INDEX IF NOT EXISTS idx_past_questions_session ON past_questions(session);
CREATE INDEX IF NOT EXISTS idx_past_questions_created ON past_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_past_questions_downloads ON past_questions(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_saved_questions_user ON saved_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_download_history_user ON download_history(user_id);
CREATE INDEX IF NOT EXISTS idx_download_history_downloaded ON download_history(downloaded_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_history ENABLE ROW LEVEL SECURITY;

-- Schools: Public read access
CREATE POLICY "Anyone can view schools"
ON schools FOR SELECT
TO public
USING (true);

-- Departments: Public read access
CREATE POLICY "Anyone can view departments"
ON departments FOR SELECT
TO public
USING (true);

-- Users: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Users: Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Past Questions: Anyone can view
CREATE POLICY "Anyone can view past questions"
ON past_questions FOR SELECT
TO public
USING (true);

-- Past Questions: Only admins can insert
CREATE POLICY "Only admins can upload questions"
ON past_questions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Past Questions: Only admins can update
CREATE POLICY "Only admins can update questions"
ON past_questions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Past Questions: Only admins can delete
CREATE POLICY "Only admins can delete questions"
ON past_questions FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Saved Questions: Users can view their own saves
CREATE POLICY "Users can view own saves"
ON saved_questions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Saved Questions: Users can insert their own saves
CREATE POLICY "Users can save questions"
ON saved_questions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Saved Questions: Users can delete their own saves
CREATE POLICY "Users can unsave questions"
ON saved_questions FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Download History: Users can view their own history
CREATE POLICY "Users can view own history"
ON download_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Download History: Users can insert their own downloads
CREATE POLICY "Users can record downloads"
ON download_history FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for past_questions table
CREATE TRIGGER update_past_questions_updated_at
BEFORE UPDATE ON past_questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE schools IS 'Academic schools within the institution';
COMMENT ON TABLE departments IS 'Departments within each school';
COMMENT ON TABLE users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE past_questions IS 'Past examination questions repository';
COMMENT ON TABLE saved_questions IS 'User bookmarked questions';
COMMENT ON TABLE download_history IS 'Track user download activity';
