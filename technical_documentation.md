# Technical Documentation: Digital Past Question Platform (YABATECH)

This document contains detailed technical notes and design specifications for the Digital Past Question Platform. This content is structured to be used as input for an academic project report.

---

## Chapter One: Introduction (Technical Notes)

### 1.1 Background Motivation
- Transition from physical to digital: The traditional method of accessing past questions at Yaba College of Technology involves visitng physical libraries or student union secretariats.
- Digital Accessibility: Need for a centralized, 24/7 accessible repository of academic materials.
- Preservation: Digitization prevents the wear and tear or loss of rare physical copies of older exam scripts.

### 1.2 Problems with Manual System
- Physical Constraints: Students must be physically present on campus to access materials.
- Limited Availability: Physical copies are often lost, misplaced, or only available in single copies.
- Inefficiency: Manual searching through piles of paper is time-consuming for students and staff.
- Distribution Costs: Printing and photocopying costs for both students and the institution.

### 1.3 Objectives of the Digital Platform
- To develop a web-based repository for YABATECH past questions.
- To implement an efficient filtering system by School, Department, Level, and Year.
- To provide administrative tools for secure uploading and management of PDF materials.
- To ensure seamless viewing and downloading capabilities for registered students.

### 1.4 Scope of the System
- **Included**: Student portal for searching/viewing, Admin dashboard for uploads, Database of past questions across all YABATECH schools, PDF viewer integration.
- **Excluded**: Online examination conducting, general forum functionality, physical bookstore integration.

### 1.5 Importance to YABATECH Students
- Enhanced academic preparation through easy access to reference materials.
- Reduction in academic stress by providing a structured study aid.
- Cost-saving through digital access instead of commercial photocopy vendors on campus.

### 1.6 Definition of Technical Terms
- **Next.js**: A React-based framework for building fast, SEO-friendly web applications.
- **TypeScript**: A superset of JavaScript that adds static typing for better code reliability.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Prisma**: A modern Object-Relational Mapper (ORM) for TypeScript and Node.js.
- **SSR (Server-Side Rendering)**: Generating page content on the server rather than the browser.
- **API (Application Programming Interface)**: An intermediary that allows two applications to talk to each other.

---

## Chapter Two: Literature Review (Technical References)

### 2.1 Digital Libraries and Repositories
- Focus on the evolution of Institutional Repositories (IRs) in academic settings.
- Reference to DSpace and EPrints as industry standards for digital archiving.
- Shift towards specialized educational portals that focus on "Question Banks" as distinct from general library systems.

### 2.2 Comparison with Existing Platforms
- **Existing Systems**: Platforms like MySchool.ng or individual departmental blogs.
- **Gaps Identified**:
    - Lack of institution-specific focus (YABATECH-specific hierarchy missing).
    - Poor UI/UX on existing Nigerian academic portals.
    - Lack of mobile responsiveness on older systems.
    - Absence of verified academic years directly from the institution's department.

### 2.3 System Gaps & Design Decisions
- **Gap**: Fragmented storage of past questions.
- **Decision**: Centralized PostgreSQL/SQLite database with a structured schema for school/department hierarchy.
- **Gap**: Slow search speeds on large repositories.
- **Decision**: Client-side filtering combined with server-side indexing for near-instant results.

### 2.4 Technical Insights
- Implementation of a "headless" architecture allows the frontend to stay decoupled from the storage layer.
- Adoption of modern UI patterns (Dark Mode, Glassmorphism) to increase student engagement and accessibility during night-study sessions.

---

## Chapter Three: System Analysis and Design

### 3.1 Analysis of Existing Manual System
- Current process: Student visits Office -> Requests folder -> Manually flips through pages -> Pays for photocopy.
- Constraints: Limited to office hours (8 AM - 4 PM), physical degradation of papers, potential for missing pages.

### 3.2 Features of Proposed Digital System
- Institutional hierarchy filtering (School -> Department -> Course -> Level -> Year).
- Secure Admin login for document management.
- Real-time search with visual feedback.
- Portable Document Format (PDF) integration with embedded viewer.
- Responsive design for smartphones and desktops.

### 3.3 Functional Requirements
- **FR1**: System must allow admin to upload PDF files with metadata.
- **FR2**: System must allow students to filter questions by multiple parameters.
- **FR3**: System must provide a direct download link for PDFs.
- **FR4**: System must maintain a searchable index of courses.

### 3.4 Non-Functional Requirements
- **NFR1 (Performance)**: Page load time should be under 2 seconds.
- **NFR2 (Security)**: Admin routes must be protected via authentication.
- **NFR3 (Reliability)**: 99.9% availability of the digital library.
- **NFR4 (Scalability)**: System should handle up to 50,000 document entries without performance degradation.

### 3.5 System Architecture
- **Frontend Layer**: Next.js (React) handling the presentation and client-side state.
- **Application Layer**: Next.js Server Actions providing the business logic and secure data fetching.
- **Database Layer**: Prisma ORM interacting with a relational database (SQLite/PostgreSQL).
- **Storage Layer**: Local/Cloud storage for the physical `.pdf` files.

### 3.6 Database Design (Entity Relationship)

#### Entities:
1. **School**: Name, Description.
2. **Department**: Name, SchoolID.
3. **Course**: Code, Title, DepartmentID.
4. **PastQuestion**: Year, Level, Semester, FileURL, CourseID.
5. **Admin**: Username, Password(Hashed).

#### Relationships:
- 1 School has Many Departments.
- 1 Department has Many Courses.
- 1 Course has Many PastQuestions.

#### Schema Snippet (Prisma):
```prisma
model School {
  id          String       @id @default(cuid())
  name        String
  departments Department[]
}

model Department {
  id       String   @id @default(cuid())
  name     String
  schoolId String
  school   School   @relation(fields: [schoolId], references: [id])
  courses  Course[]
}

model PastQuestion {
  id        String   @id @default(cuid())
  year      Int
  level     String   // ND1, ND2, HND1, HND2
  fileUrl   String
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id])
}
```

---

## Chapter Four: Methodology and Implementation

### 4.1 Development Methodology
- **Agile SDLC**: Chosen for its iterative nature, allowing for rapid feedback from YABATECH stakeholders.
- **Incremental Development**: Features (Search -> View -> Admin) were developed and tested in blocks.

### 4.2 Technology Stack Justification
- **TypeScript**: Used for robust type-safety, reducing runtime errors in the academic material management.
- **Next.js 16 (App Router)**: Selected for its high performance, easy deployment, and first-class SEO support for a public-facing academic platform.
- **Tailwind CSS 4**: Effortless styling with a utility-first approach, ensuring the "modern/premium" aesthetic requested.
- **SQLite/PostgreSQL**: Reliable relational data storage for complex departmental structures.
- **Prisma**: To abstract database queries into typed methods, speeding up development.

### 4.3 UI Implementation Approach
- **Modern Aesthetic**: Use of the `zinc` color palette (Zinc-900 for dark mode, Zinc-50 for light mode).
- **Glassmorphism**: Subtle translucent effects on navigation bars and cards for a premium feel.
- **Responsiveness**: Mobile-first design using Tailwind's `sm:`, `md:`, and `lg:` breakpoints.
- **Accessibility**: High contrast ratios and semantic HTML for screen-reader compatibility.

### 4.4 Logic Implementation
- **Filtering Logic**: Implemented using React `useState` and `useMemo` for real-time client-side filtering of the question bank.
- **File Downloads**: Handled via standard HTML `<a>` tags with the `download` attribute, pointing to secure storage URLs.
- **Admin Uploads**: Handled via Next.js Server Actions with file validation (MIME type check for PDF).

### 4.5 Authentication and Authorization
- **Middleware**: Used to intercept requests to the `/admin` path.
- **Session Management**: JWT-based authentication for secure, stateless admin access.

### 4.6 Testing Strategies
- **Unit Testing**: Testing individual utility functions (e.g., file size formatters).
- **Integration Testing**: Ensuring the database connections successfully fetch metadata for the frontend.
- **Manual QA**: Verifying PDF rendering across Chrome, Safari, and Edge browsers.

### 4.7 Maintenance and Scalability
- **Scalability**: The system is designed to migrate easily from SQLite to PostgreSQL as the volume of questions grows.
- **Maintenance**: Structured codebase with clear separation of concerns (Components vs. Actions vs. Types) allows for easy updates by future YABATECH student developers.

### 4.8 Technical Recommendations
- Implementation of a global CDN (like Vercel Blob or Cloudinary) for faster PDF delivery.
- Integration of an AI-based OCR (Optical Character Recognition) to make scanned older questions searchable.

### 4.9 Conclusion (Technical Summary)
The Digital Past Question Platform addresses a critical gap in YABATECH's academic ecosystem. By leveraging modern frameworks like Next.js and TypeScript, the system provides a scalable, secure, and visually pleasing solution that modernizes student study workflows and preserves historical academic data.
