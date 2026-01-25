// This is a Prisma schema representation for reference.
// The primary goal is to support complex filtering by School -> Dept -> Course -> Level -> Year.

/*
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  ADMIN
}

enum Level {
  ND1
  ND2
  HND1
  HND2
}

enum Semester {
  FIRST
  SECOND
}

enum QuestionType {
  THEORY
  PRACTICAL
  GENERAL
  ASSIGNMENT
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  matricNo      String?   @unique
  password      String
  role          Role      @default(STUDENT)
  image         String?
  departmentId  String?
  department    Department? @relation(fields: [departmentId], references: [id])
  history       Download[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model School {
  id          String       @id @default(cuid())
  name        String       @unique // e.g., School of Technology
  departments Department[]
}

model Department {
  id          String    @id @default(cuid())
  name        String    // e.g., Computer Science
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id])
  courses     Course[]
  users       User[]
}

model Course {
  id            String         @id @default(cuid())
  code          String         @unique // e.g., COM 311
  title         String         // e.g., Operating Systems II
  departmentId  String
  department    Department     @relation(fields: [departmentId], references: [id])
  questions     PastQuestion[]
}

model PastQuestion {
  id          String       @id @default(cuid())
  title       String       // Full display title
  courseId    String
  course      Course       @relation(fields: [courseId], references: [id])
  session     String       // e.g., 2022/2023
  semester    Semester
  level       Level
  type        QuestionType @default(THEORY)
  fileUrl     String       // URL to S3 storage
  fileSize    String       // e.g. 2.4 MB
  downloads   Download[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Download {
  id             String       @id @default(cuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  pastQuestionId String
  pastQuestion   PastQuestion @relation(fields: [pastQuestionId], references: [id])
  downloadedAt   DateTime     @default(now())
}
*/
