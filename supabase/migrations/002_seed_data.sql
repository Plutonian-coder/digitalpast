-- Digital Past Question Platform - Seed Data
-- Migration: 002_seed_data
-- Updated: 2026-02-12 (New School Structure)

-- ============================================
-- SEED SCHOOLS
-- ============================================

INSERT INTO schools (name, slug, description) VALUES
('Engineering', 'engineering', 'Agricultural & Bio-Environmental, Chemical, Civil, Computer, etc.'),
('School of Technology', 'technology', 'Computer Science, Agricultural Technology, Food Technology, Hospitality Management, etc.'),
('School of Applied Science', 'applied-science', 'Science Laboratory Technology (SLT), Statistics, Mathematics'),
('Environmental Studies', 'environmental', 'Architectural Technology, Building Technology, Estate Management, etc.'),
('Management & Business', 'management-business', 'Accountancy, Banking & Finance, Business Administration, etc.'),
('Arts & General Studies', 'arts-general', 'Art and Industrial Design, Fashion Design, Mass Communication')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- ============================================
-- SEED DEPARTMENTS
-- ============================================

-- Helper function to insert department if school exists
DO $$
DECLARE
  school_id UUID;
BEGIN

  -- Engineering
  SELECT id INTO school_id FROM schools WHERE slug = 'engineering';
  IF school_id IS NOT NULL THEN
    INSERT INTO departments (school_id, name, code) VALUES
    (school_id, 'Agricultural & Bio-Environmental', 'ABE'),
    (school_id, 'Chemical', 'CHE'),
    (school_id, 'Civil', 'CIV'),
    (school_id, 'Computer', 'COM'),
    (school_id, 'Electrical/Electronics', 'ELE'),
    (school_id, 'Industrial Maintenance', 'IND'),
    (school_id, 'Marine', 'MAR'),
    (school_id, 'Mechanical', 'MEC'),
    (school_id, 'Mechatronics', 'MCT'),
    (school_id, 'Metallurgical', 'MET'),
    (school_id, 'Polymer', 'POL'),
    (school_id, 'Welding & Fabrication Technology', 'WFT')
    ON CONFLICT DO NOTHING;
  END IF;

  -- School of Technology
  SELECT id INTO school_id FROM schools WHERE slug = 'technology';
  IF school_id IS NOT NULL THEN
    INSERT INTO departments (school_id, name, code) VALUES
    (school_id, 'Agricultural Technology', 'AGT'),
    (school_id, 'Food Technology', 'FDT'),
    (school_id, 'Hospitality Management', 'HPM'),
    (school_id, 'Leisure & Tourism', 'LTM'),
    (school_id, 'Polymer Technology', 'PTY'),
    (school_id, 'Textile Technology', 'TXT'),
    (school_id, 'Printing Technology', 'PRT'),
    (school_id, 'Computer Science', 'CSC')
    ON CONFLICT DO NOTHING;
  END IF;

  -- School of Applied Science
  SELECT id INTO school_id FROM schools WHERE slug = 'applied-science';
  IF school_id IS NOT NULL THEN
    INSERT INTO departments (school_id, name, code) VALUES
    (school_id, 'Science Laboratory Technology (SLT)', 'SLT'),
    (school_id, 'Statistics', 'STA'),
    (school_id, 'Mathematics', 'MTH')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Environmental Studies
  SELECT id INTO school_id FROM schools WHERE slug = 'environmental';
  IF school_id IS NOT NULL THEN
    INSERT INTO departments (school_id, name, code) VALUES
    (school_id, 'Architectural Technology', 'ARC'),
    (school_id, 'Building Technology', 'BLD'),
    (school_id, 'Estate Management & Valuation', 'EMV'),
    (school_id, 'Quantity Surveying', 'QUS'),
    (school_id, 'Surveying & Geo-Informatics', 'SUG'),
    (school_id, 'Urban & Regional Planning', 'URP')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Management & Business
  SELECT id INTO school_id FROM schools WHERE slug = 'management-business';
  IF school_id IS NOT NULL THEN
    INSERT INTO departments (school_id, name, code) VALUES
    (school_id, 'Accountancy', 'ACC'),
    (school_id, 'Banking & Finance', 'BKF'),
    (school_id, 'Business Administration & Management', 'BAM'),
    (school_id, 'Marketing', 'MKT'),
    (school_id, 'Office Technology & Management', 'OTM'),
    (school_id, 'Public Administration', 'PAD')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Arts & General Studies
  SELECT id INTO school_id FROM schools WHERE slug = 'arts-general';
  IF school_id IS NOT NULL THEN
    INSERT INTO departments (school_id, name, code) VALUES
    (school_id, 'Art and Industrial Design', 'AID'),
    (school_id, 'Fashion Design & Clothing Technology', 'FDC'),
    (school_id, 'Mass Communication', 'MAC')
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
