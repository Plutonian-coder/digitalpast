-- Migration: 004_remove_slt_from_technology
-- Description: Remove "Science Laboratory Technology (SLT)" from School of Technology.
-- SLT belongs under School of Applied Science, not Technology.

-- Remove any SLT department entries that are under the School of Technology
DELETE FROM departments
WHERE code = 'SLT'
AND school_id = (SELECT id FROM schools WHERE slug = 'technology');

-- Verify SLT still exists under Applied Science (if not, insert it)
DO $$
DECLARE
  applied_school_id UUID;
  slt_exists BOOLEAN;
BEGIN
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
END $$;
