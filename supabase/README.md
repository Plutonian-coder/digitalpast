# Supabase Database Setup

This directory contains database migration scripts for the Digital Past Question Platform.

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be provisioned
4. Copy your project URL and anon key

### 2. Configure Environment Variables
Update `.env.local` in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Migrations

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file in order:
   - `migrations/001_initial_schema.sql`
   - `migrations/002_seed_data.sql`
4. Click **Run** for each script

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Configure Storage

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named `questions`
3. Set bucket to **Public**
4. Add storage policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'questions');

-- Allow public downloads
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'questions');

-- Allow admins to delete
CREATE POLICY "Allow admin deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'questions' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

### 5. Create Admin User

1. Sign up through the application at `/signup`
2. Go to Supabase dashboard → **Authentication** → **Users**
3. Find your user and copy the user ID
4. Go to **SQL Editor** and run:

```sql
-- Update user role to admin
UPDATE users
SET role = 'admin'
WHERE id = 'your-user-id-here';
```

### 6. Verify Setup

Run these queries in SQL Editor to verify:

```sql
-- Check schools
SELECT * FROM schools;

-- Check departments
SELECT * FROM departments;

-- Check your admin user
SELECT id, email, role FROM users WHERE role = 'admin';

-- Verify RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Migration Files

- **001_initial_schema.sql** - Creates all tables, indexes, RLS policies, and triggers
- **002_seed_data.sql** - Inserts initial schools and departments

## Database Schema

### Tables
- `schools` - Academic schools
- `departments` - Departments within schools
- `users` - User profiles (extends auth.users)
- `past_questions` - Past question repository
- `saved_questions` - User bookmarks
- `download_history` - Download tracking

### Key Features
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Automatic timestamp updates
- ✅ Foreign key constraints
- ✅ Performance indexes
- ✅ Data validation constraints

## Troubleshooting

### "relation already exists" error
This is normal if you're re-running migrations. The `IF NOT EXISTS` clauses prevent errors.

### RLS policies blocking queries
Make sure you're authenticated when testing. Use the Supabase dashboard to test as an authenticated user.

### Storage bucket not accessible
Verify the bucket is set to **Public** and storage policies are created.

## Next Steps

After database setup:
1. Test admin upload functionality
2. Upload sample past questions
3. Test student browsing and downloading
4. Verify download tracking works
5. Test save/bookmark functionality
