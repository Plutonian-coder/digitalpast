-- Digital Past Question Platform - Seed Data
-- Migration: 002_seed_data
-- Created: 2026-01-31

-- ============================================
-- SEED SCHOOLS
-- ============================================

INSERT INTO schools (name, slug, description) VALUES
('School of Technology', 'technology', 'Computer Science, Food Technology, Science Laboratory Technology, and more'),
('School of Management', 'management', 'Accountancy, Business Administration, Office Technology Management, and more'),
('School of Engineering', 'engineering', 'Civil Engineering, Electrical Engineering, Mechanical Engineering'),
('School of Art & Design', 'art-design', 'Graphics Design, Fashion Design, Fine Arts, and more'),
('School of Environmental Studies', 'environmental', 'Architecture, Estate Management, Surveying and Geoinformatics'),
('School of Applied Sciences', 'applied-sciences', 'Statistics, Mathematics, Physics, Chemistry')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DEPARTMENTS - SCHOOL OF TECHNOLOGY
-- ============================================

INSERT INTO departments (school_id, name, code)
SELECT 
  (SELECT id FROM schools WHERE slug = 'technology'),
  dept.name,
  dept.code
FROM (VALUES
  ('Computer Science', 'CS'),
  ('Food Technology', 'FT'),
  ('Science Laboratory Technology', 'SLT'),
  ('Hospitality Management', 'HM'),
  ('Leisure and Tourism Management', 'LTM')
) AS dept(name, code)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DEPARTMENTS - SCHOOL OF MANAGEMENT
-- ============================================

INSERT INTO departments (school_id, name, code)
SELECT 
  (SELECT id FROM schools WHERE slug = 'management'),
  dept.name,
  dept.code
FROM (VALUES
  ('Accountancy', 'ACC'),
  ('Business Administration', 'BA'),
  ('Office Technology Management', 'OTM'),
  ('Marketing', 'MKT'),
  ('Banking and Finance', 'BF')
) AS dept(name, code)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DEPARTMENTS - SCHOOL OF ENGINEERING
-- ============================================

INSERT INTO departments (school_id, name, code)
SELECT 
  (SELECT id FROM schools WHERE slug = 'engineering'),
  dept.name,
  dept.code
FROM (VALUES
  ('Civil Engineering', 'CE'),
  ('Electrical Engineering', 'EE'),
  ('Mechanical Engineering', 'ME'),
  ('Mechatronics Engineering', 'MCE'),
  ('Chemical Engineering', 'CHE')
) AS dept(name, code)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DEPARTMENTS - SCHOOL OF ART & DESIGN
-- ============================================

INSERT INTO departments (school_id, name, code)
SELECT 
  (SELECT id FROM schools WHERE slug = 'art-design'),
  dept.name,
  dept.code
FROM (VALUES
  ('Graphics Design', 'GD'),
  ('Fashion Design', 'FD'),
  ('Fine Arts', 'FA'),
  ('Printing Technology', 'PT')
) AS dept(name, code)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DEPARTMENTS - SCHOOL OF ENVIRONMENTAL
-- ============================================

INSERT INTO departments (school_id, name, code)
SELECT 
  (SELECT id FROM schools WHERE slug = 'environmental'),
  dept.name,
  dept.code
FROM (VALUES
  ('Architecture', 'ARC'),
  ('Estate Management', 'EM'),
  ('Surveying and Geoinformatics', 'SG'),
  ('Urban and Regional Planning', 'URP'),
  ('Quantity Surveying', 'QS')
) AS dept(name, code)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DEPARTMENTS - SCHOOL OF APPLIED SCIENCES
-- ============================================

INSERT INTO departments (school_id, name, code)
SELECT 
  (SELECT id FROM schools WHERE slug = 'applied-sciences'),
  dept.name,
  dept.code
FROM (VALUES
  ('Statistics', 'STAT'),
  ('Mathematics', 'MATH'),
  ('Physics', 'PHY'),
  ('Chemistry', 'CHEM')
) AS dept(name, code)
ON CONFLICT DO NOTHING;
