-- Migration: 004_fix_technology_departments
-- Description: 
--   1. Remove "Science Laboratory Technology (SLT)" from School of Technology
--   2. Ensure Polymer Technology & Textile Technology are under School of Technology
--   SLT belongs under School of Applied Science, not Technology.

-- 1. Remove any SLT department entries that are under the School of Technology
DELETE FROM departments
WHERE code = 'SLT'
AND school_id = (SELECT id FROM schools WHERE slug = 'technology');

-- 2. Verify SLT still exists under Applied Science (if not, insert it)
DO $$
DECLARE
  applied_school_id UUID;
  tech_school_id UUID;
  slt_exists BOOLEAN;
BEGIN
  -- Ensure SLT is under Applied Science
  SELECT id INTO applied_school_id FROM schools WHERE slug = 'applied-science';
  
  IF applied_school_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM departments WHERE code = 'SLT' AND school_id = applied_school_id
    ) INTO slt_exists;
    
    IF NOT slt_exists THEN
      INSERT INTO departments (school_id, name, code)
      VALUES (applied_school_id, 'Science Laboratory Technology (SLT)', 'SLT');
    END IF;
  END IF;

  -- Ensure Polymer Technology & Textile Technology are under School of Technology
  SELECT id INTO tech_school_id FROM schools WHERE slug = 'technology';
  
  IF tech_school_id IS NOT NULL THEN
    -- Move Polymer Technology to Technology (or insert if not exists)
    UPDATE departments SET school_id = tech_school_id WHERE code = 'PTY';
    IF NOT FOUND THEN
      INSERT INTO departments (school_id, name, code)
      VALUES (tech_school_id, 'Polymer Technology', 'PTY')
      ON CONFLICT DO NOTHING;
    END IF;

    -- Move Textile Technology to Technology (or insert if not exists)
    UPDATE departments SET school_id = tech_school_id WHERE code = 'TXT';
    IF NOT FOUND THEN
      INSERT INTO departments (school_id, name, code)
      VALUES (tech_school_id, 'Textile Technology', 'TXT')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;
