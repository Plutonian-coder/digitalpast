# Digital Past Question Platform - Technical Documentation

## Executive Summary

The **Digital Past Question Platform** is a modern web application designed to serve Yabatech students by providing centralized access to past examination questions across all departments and schools. The platform enables students to browse, search, filter, and download past questions while allowing administrators to upload and manage the question repository.

### Key Features
- 🔐 **Secure Authentication** - Student and admin user management
- 📚 **Comprehensive Repository** - Organized by School → Department → Course → Level
- 🔍 **Advanced Filtering** - Multi-criteria search and filtering
- 📥 **Download Tracking** - Monitor question popularity and usage
- 💾 **Personal Collections** - Save questions for quick access
- 📊 **Analytics Dashboard** - View statistics and recent additions
- 🎨 **Modern UI/UX** - Responsive design with dark mode support

---

## 1. Project Architecture

### 1.1 Technology Stack

#### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.4 | React framework with App Router |
| **React** | 19.2.3 | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Framer Motion** | 12.29.0 | Animation library |
| **Lucide React** | 0.563.0 | Icon library |

#### Backend & Services
| Technology | Purpose |
|-----------|---------|
| **Supabase** | Backend-as-a-Service (BaaS) |
| **Supabase Auth** | User authentication & authorization |
| **Supabase Database** | PostgreSQL database |
| **Supabase Storage** | File storage for PDFs |

#### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Babel React Compiler** - React optimization

### 1.2 Architecture Pattern

The application follows a **modern JAMstack architecture**:

```
┌─────────────────────────────────────────────┐
│           Client (Next.js App)              │
│  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │ Components │            │
│  └────────────┘  └────────────┘            │
│         │              │                    │
│         └──────┬───────┘                    │
│                │                            │
│         ┌──────▼───────┐                    │
│         │ Supabase SDK │                    │
│         └──────┬───────┘                    │
└────────────────┼────────────────────────────┘
                 │
                 │ HTTPS/REST API
                 │
┌────────────────▼────────────────────────────┐
│         Supabase Backend                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │   Auth  │  │Database │  │ Storage │    │
│  │         │  │(Postgres)│  │  (S3)  │    │
│  └─────────┘  └─────────┘  └─────────┘    │
└─────────────────────────────────────────────┘
```

**Key Architectural Decisions**:
1. **Server-Side Rendering (SSR)** - Next.js App Router for optimal performance
2. **Client-Side State** - React hooks for local state management
3. **Real-time Capabilities** - Supabase real-time subscriptions (future enhancement)
4. **Static Generation** - Pre-rendered pages for landing and marketing content

---

## 2. Technical Requirements

### 2.1 System Requirements

#### Development Environment
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: For version control
- **Code Editor**: VS Code (recommended)

#### Production Environment
- **Hosting**: Vercel (recommended) or any Node.js hosting
- **Database**: Supabase PostgreSQL instance
- **Storage**: Supabase Storage bucket
- **CDN**: Automatic via Vercel Edge Network

### 2.2 Environment Variables

Required environment variables in `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

### 2.3 Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 3. Database Design

### 3.1 Entity Relationship Diagram

```
┌──────────────┐
│   Schools    │
│──────────────│
│ id (PK)      │
│ name         │
│ slug         │
│ description  │
└──────┬───────┘
       │
       │ 1:N
       │
┌──────▼───────────┐
│  Departments     │
│──────────────────│
│ id (PK)          │
│ school_id (FK)   │
│ name             │
│ code             │
└──────┬───────────┘
       │
       │ 1:N
       │
┌──────▼────────────────┐         ┌──────────────┐
│   Past Questions      │◄────────│    Users     │
│───────────────────────│  N:1    │──────────────│
│ id (PK)               │         │ id (PK)      │
│ course_code           │         │ full_name    │
│ course_title          │         │ email        │
│ department_id (FK)    │         │ matric_no    │
│ level                 │         │ role         │
│ session               │         └──────┬───────┘
│ semester              │                │
│ question_type         │                │
│ file_url              │                │
│ file_size             │                │
│ pages                 │                │
│ uploaded_by (FK)      │                │
│ download_count        │                │
└───────┬───────────────┘                │
        │                                │
        │ 1:N                            │ 1:N
        │                                │
┌───────▼──────────────┐    ┌────────────▼──────────┐
│ Download History     │    │  Saved Questions      │
│──────────────────────│    │───────────────────────│
│ id (PK)              │    │ id (PK)               │
│ user_id (FK)         │    │ user_id (FK)          │
│ question_id (FK)     │    │ question_id (FK)      │
│ downloaded_at        │    │ created_at            │
└──────────────────────┘    └───────────────────────┘
```

### 3.2 Table Schemas

#### Schools Table
```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Organize departments by academic schools (e.g., School of Technology, School of Management)

#### Departments Table
```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Store department information within each school

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  matric_number TEXT UNIQUE,
  department_id UUID REFERENCES departments(id),
  level TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Extend Supabase auth with custom user profile data

**Roles**:
- `student` - Regular users who can browse and download
- `admin` - Users who can upload and manage questions

#### Past Questions Table
```sql
CREATE TABLE past_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  level TEXT NOT NULL,
  session TEXT NOT NULL,
  semester TEXT NOT NULL,
  question_type TEXT NOT NULL,
  file_url TEXT,
  file_size BIGINT,
  pages INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES auth.users(id),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Store metadata for each past question document

**Enums**:
- `level`: "ND 1", "ND 2", "HND 1", "HND 2"
- `semester`: "1st Semester", "2nd Semester"
- `question_type`: "Theory", "Practical", "Assignment", "Lab"

#### Saved Questions Table
```sql
CREATE TABLE saved_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES past_questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);
```

**Purpose**: Track questions saved/bookmarked by users

#### Download History Table
```sql
CREATE TABLE download_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES past_questions(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Track download history for analytics and user history

### 3.3 Database Indexes

Performance optimization indexes:

```sql
CREATE INDEX idx_departments_school ON departments(school_id);
CREATE INDEX idx_past_questions_department ON past_questions(department_id);
CREATE INDEX idx_past_questions_level ON past_questions(level);
CREATE INDEX idx_past_questions_session ON past_questions(session);
CREATE INDEX idx_saved_questions_user ON saved_questions(user_id);
CREATE INDEX idx_download_history_user ON download_history(user_id);
```

### 3.4 Row Level Security (RLS)

Supabase RLS policies ensure data security:

**Users Table**:
- Users can view and update their own profile only

**Past Questions Table**:
- Anyone can view (public read access)
- Only admins can insert new questions

**Saved Questions & Download History**:
- Users can only access their own data

---

## 4. Frontend Implementation

### 4.1 Application Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Dashboard with layout
│   ├── browse/            # Browse questions page
│   ├── admin/
│   │   └── upload/        # Admin upload page
│   ├── question/[id]/     # Question detail page
│   ├── saved/             # Saved questions page
│   ├── history/           # Download history page
│   └── settings/          # User settings page
├── components/
│   ├── ui/                # Reusable UI components
│   ├── sidebar.tsx        # Dashboard sidebar
│   ├── app-navbar.tsx     # Main navigation
│   └── mode-toggle.tsx    # Dark mode toggle
├── lib/
│   ├── supabase.ts        # Supabase client & helpers
│   └── utils.ts           # Utility functions
└── context/
    └── sidebar-context.tsx # Sidebar state management
```

### 4.2 Key Pages

#### Landing Page ([`page.tsx`](file:///c:/Users/HomePC/digitalpast/src/app/page.tsx))
- Hero section with call-to-action
- Features showcase
- Statistics display
- Testimonials
- Footer with links

#### Dashboard ([`dashboard/page.tsx`](file:///c:/Users/HomePC/digitalpast/src/app/dashboard/page.tsx))
**Features**:
- Personalized greeting
- Quick stats (total questions, newest, most popular)
- Recent questions list
- Browse by school shortcuts
- Search functionality

**Data Sources**:
- Fetches from `past_questions` table
- Aggregates statistics
- Displays recent additions

#### Browse Page ([`browse/page.tsx`](file:///c:/Users/HomePC/digitalpast/src/app/browse/page.tsx))
**Features**:
- Advanced filtering sidebar
  - School selection
  - Department selection
  - Level filter
  - Session year filter
- Search by course code/title
- Sort by newest or most popular
- Question cards with metadata
- Modal for question preview

**Implementation Highlights**:
```typescript
// Dynamic filtering with Supabase
let query = supabase.from('past_questions').select('*');

if (selectedLevel) query = query.eq('level', selectedLevel);
if (selectedDepartment) query = query.eq('department_id', selectedDepartment);
if (selectedSession) query = query.eq('session', selectedSession);
if (searchQuery) query = query.or(`course_code.ilike.%${searchQuery}%,course_title.ilike.%${searchQuery}%`);

query = query.order('created_at', { ascending: false });
```

#### Admin Upload ([`admin/upload/page.tsx`](file:///c:/Users/HomePC/digitalpast/src/app/admin/upload/page.tsx))
**Features**:
- File upload (PDF only, max 25MB)
- Metadata form:
  - Course code and title
  - School and department selection
  - Academic year, semester, level
  - Question type
- Upload to Supabase Storage
- Database record creation
- Success/error feedback

**Upload Flow**:
1. User selects PDF file
2. User fills metadata form
3. File uploaded to Supabase Storage bucket
4. Public URL generated
5. Metadata saved to `past_questions` table
6. Success confirmation displayed

### 4.3 Component Architecture

#### UI Components
The application uses a component-based architecture with reusable UI elements:

- **Button** - Styled button with variants
- **Input** - Form input fields
- **Card** - Content containers
- **Label** - Form labels
- **Dialog** - Modal dialogs
- **Tooltip** - Hover tooltips

#### Custom Components
- **WavyBackground** - Animated background for auth pages
- **GridPattern** - Decorative grid background
- **ThemeToggle** - Dark/light mode switcher
- **AuthCard** - Unified login/signup form
- **Sidebar** - Dashboard navigation

### 4.4 Styling Approach

**Tailwind CSS Configuration**:
- Custom color palette
- Dark mode support via `next-themes`
- Responsive breakpoints
- Custom animations

**Design System**:
- Rounded corners (2rem, 2.5rem for cards)
- Blue accent color (#3B82F6)
- Consistent spacing scale
- Typography hierarchy

---

## 5. Backend Services (Supabase)

### 5.1 Authentication

**Implementation**: [`lib/supabase.ts`](file:///c:/Users/HomePC/digitalpast/src/lib/supabase.ts)

**Auth Methods**:
```typescript
// Sign up new user
auth.signUp(email, password, metadata)

// Sign in existing user
auth.signIn(email, password)

// Sign out
auth.signOut()

// Get current user
auth.getCurrentUser()

// Get current session
auth.getSession()

// Listen to auth changes
auth.onAuthStateChange(callback)
```

**User Metadata**:
- `full_name` - User's full name
- `matric_number` - Student matriculation number (optional)

**Session Management**:
- JWT-based authentication
- Automatic token refresh
- Secure HTTP-only cookies

### 5.2 Database Operations

**TypeScript Types**:
All database entities have TypeScript interfaces for type safety:

```typescript
export type School = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
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
```

**Common Queries**:

```typescript
// Fetch all schools
const { data: schools } = await supabase
  .from('schools')
  .select('*')
  .order('name');

// Fetch questions with filters
const { data: questions } = await supabase
  .from('past_questions')
  .select('*')
  .eq('level', 'ND 1')
  .eq('department_id', deptId)
  .order('created_at', { ascending: false });

// Insert new question
const { error } = await supabase
  .from('past_questions')
  .insert({
    course_code: 'COM 311',
    course_title: 'Operating Systems II',
    department_id: deptId,
    level: 'ND 2',
    session: '2023/2024',
    semester: '1st Semester',
    question_type: 'Theory',
    file_url: publicUrl,
    file_size: fileSize,
    uploaded_by: userId
  });
```

### 5.3 File Storage

**Storage Bucket**: `questions`

**Configuration**:
- Public bucket (for downloads)
- Accepts PDF files only
- Max file size: 25MB (configurable)

**Upload Process**:
```typescript
// 1. Upload file to storage
const { data, error } = await supabase.storage
  .from('questions')
  .upload(filePath, file);

// 2. Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('questions')
  .getPublicUrl(filePath);

// 3. Save URL to database
await supabase.from('past_questions').insert({
  file_url: publicUrl,
  // ... other metadata
});
```

**File Naming Convention**:
```
[random-string]-[timestamp].[extension]
Example: abc123xyz-1706745600000.pdf
```

---

## 6. Security Implementation

### 6.1 Authentication Security
- Password minimum length: 6 characters
- Email verification (can be enabled in Supabase)
- Secure session management
- Protected routes with middleware

### 6.2 Authorization
- Role-based access control (RBAC)
- Admin-only upload functionality
- User-specific data access (RLS)

### 6.3 Data Validation
- Client-side form validation
- Server-side validation via RLS
- File type restrictions (PDF only)
- File size limits

### 6.4 Best Practices
- Environment variables for secrets
- HTTPS-only communication
- CORS configuration
- SQL injection prevention (via Supabase)

---

## 7. Deployment Guide

### 7.1 Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note project URL and anon key

2. **Run Database Migrations**
   - Execute SQL scripts from implementation plan
   - Create all tables
   - Set up RLS policies
   - Create indexes

3. **Configure Storage**
   - Create `questions` bucket
   - Set to public
   - Configure storage policies

4. **Seed Initial Data**
   - Insert schools
   - Insert departments
   - Create admin user

### 7.2 Vercel Deployment

1. **Connect Repository**
   ```bash
   git remote add origin [your-repo-url]
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import Git repository
   - Configure project

3. **Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel auto-deploys on push
   - Production URL provided

### 7.3 Custom Domain (Optional)
- Add custom domain in Vercel settings
- Configure DNS records
- SSL automatically provisioned

---

## 8. Performance Optimization

### 8.1 Frontend Optimizations
- **Code Splitting**: Automatic via Next.js
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: Static page generation where possible

### 8.2 Database Optimizations
- **Indexes**: On frequently queried columns
- **Query Optimization**: Select only needed columns
- **Connection Pooling**: Handled by Supabase
- **Pagination**: Limit results (future enhancement)

### 8.3 Asset Optimization
- **PDF Compression**: Recommend compressed PDFs
- **CDN Delivery**: Supabase CDN for storage
- **Lazy Loading**: Load PDFs on demand

---

## 9. Future Enhancements

### 9.1 Planned Features
- [ ] Advanced search with full-text search
- [ ] Question preview without download
- [ ] User ratings and reviews
- [ ] Email notifications for new uploads
- [ ] Bulk upload for admins
- [ ] Export download history
- [ ] Mobile app (React Native)

### 9.2 Analytics Integration
- [ ] Google Analytics
- [ ] Download analytics dashboard
- [ ] Popular courses tracking
- [ ] User engagement metrics

### 9.3 Social Features
- [ ] Share questions via social media
- [ ] Study groups
- [ ] Discussion forums
- [ ] Collaborative notes

---

## 10. Maintenance & Support

### 10.1 Monitoring
- Supabase dashboard for database metrics
- Vercel analytics for frontend performance
- Error tracking (Sentry integration recommended)

### 10.2 Backup Strategy
- Supabase automatic daily backups
- Point-in-time recovery available
- Export database periodically

### 10.3 Update Procedures
1. Test changes locally
2. Deploy to staging (create preview deployment)
3. Test on staging
4. Merge to main for production deployment

---

## 11. Conclusion

The Digital Past Question Platform provides a robust, scalable solution for Yabatech students to access past examination questions. Built with modern technologies and best practices, the platform offers:

- **Reliability**: Supabase backend ensures 99.9% uptime
- **Scalability**: Can handle thousands of concurrent users
- **Security**: Enterprise-grade authentication and authorization
- **Performance**: Optimized for fast load times
- **Maintainability**: Clean code architecture and documentation

### Project Status
- **Current Phase**: Development Complete, Pending Database Setup
- **Estimated Completion**: 4-6 hours of configuration work
- **Production Ready**: After database setup and testing

### Success Metrics
- User adoption rate
- Download frequency
- Upload consistency
- System uptime
- User satisfaction

---

## Appendix

### A. Technology References
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

### B. Repository Structure
```
digitalpast/
├── .env.local              # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind config
├── next.config.ts         # Next.js config
├── public/                # Static assets
├── src/                   # Source code
└── README.md              # Project README
```

### C. Contact & Support
- **Developer**: [Your Name]
- **Institution**: Yabatech
- **Project Type**: Academic/Student Service Platform
- **License**: MIT (or as specified)

---

**Document Version**: 1.0  
**Last Updated**: January 31, 2026  
**Author**: Digital Past Development Team
