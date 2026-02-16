-- Migration: 003_update_departments
-- Description: Moves Computer Science to School of Technology and updates school descriptions.

-- 1. Update School Descriptions
UPDATE schools 
SET description = 'Computer Science, Agricultural Technology, Food Technology, Hospitality Management, etc.' 
WHERE slug = 'technology';

UPDATE schools 
SET description = 'Science Laboratory Technology (SLT), Statistics, Mathematics' 
WHERE slug = 'applied-science';

-- 2. Move Computer Science Department (CSC) to School of Technology
DO $$
DECLARE
  tech_school_id UUID;
BEGIN
  SELECT id INTO tech_school_id FROM schools WHERE slug = 'technology';
  
  IF tech_school_id IS NOT NULL THEN
    UPDATE departments 
    SET school_id = tech_school_id 
    WHERE code = 'CSC';
  END IF;
END $$;
