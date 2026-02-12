import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                process.env[key] = value;
            }
        });
        console.log('Loaded .env.local');
    } else {
        console.log('No .env.local found');
    }
} catch (e) {
    console.error('Error loading .env.local', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

// Use service key if available to bypass RLS
const supabase = createClient(supabaseUrl, serviceKey || supabaseKey);

const schoolsData = [
    {
        name: 'Engineering',
        slug: 'engineering',
        description: 'Engineering Departments',
        departments: [
            'Agricultural & Bio-Environmental', 'Chemical', 'Civil', 'Computer',
            'Electrical/Electronics', 'Industrial Maintenance', 'Marine', 'Mechanical',
            'Mechatronics', 'Metallurgical', 'Polymer', 'Welding & Fabrication Technology'
        ]
    },
    {
        name: 'School of Technology',
        slug: 'technology',
        description: 'Technology Departments',
        departments: [
            'Agricultural Technology', 'Food Technology', 'Hospitality Management',
            'Leisure & Tourism', 'Polymer Technology', 'Textile Technology', 'Printing Technology'
        ]
    },
    {
        name: 'School of Applied Science',
        slug: 'applied-science',
        description: 'Applied Science Departments',
        departments: [
            'Science Laboratory Technology (SLT)', 'Statistics', 'Mathematics', 'Computer Science'
        ]
    },
    {
        name: 'Environmental Studies',
        slug: 'environmental',
        description: 'Environmental Studies Departments',
        departments: [
            'Architectural Technology', 'Building Technology', 'Estate Management & Valuation',
            'Quantity Surveying', 'Surveying & Geo-Informatics', 'Urban & Regional Planning'
        ]
    },
    {
        name: 'Management & Business',
        slug: 'management-business',
        description: 'Management & Business Departments',
        departments: [
            'Accountancy', 'Banking & Finance', 'Business Administration & Management',
            'Marketing', 'Office Technology & Management', 'Public Administration'
        ]
    },
    {
        name: 'Arts & General Studies',
        slug: 'arts-general',
        description: 'Arts & General Studies Departments',
        departments: [
            'Art and Industrial Design', 'Fashion Design & Clothing Technology', 'Mass Communication'
        ]
    }
];

async function seed() {
    console.log('Starting seed update...');

    try {
        const { data: existingSchools } = await supabase.from('schools').select('*');

        for (const schoolData of schoolsData) {
            let schoolId;
            const existingSchool = existingSchools?.find(s => s.slug === schoolData.slug || s.name === schoolData.name);

            if (existingSchool) {
                schoolId = existingSchool.id;
                console.log(`Found existing school: ${schoolData.name}`);

                if (existingSchool.name !== schoolData.name) {
                    const { error } = await supabase.from('schools').update({ name: schoolData.name }).eq('id', schoolId);
                    if (error) console.error(`Error updating school name ${schoolData.name}:`, error);
                    else console.log(`  Updated name to: ${schoolData.name}`);
                }
            } else {
                console.log(`Creating new school: ${schoolData.name}`);
                const { data: newSchool, error } = await supabase
                    .from('schools')
                    .insert({ name: schoolData.name, slug: schoolData.slug, description: schoolData.description })
                    .select('id')
                    .single();

                if (error) {
                    console.error(`Error inserting school ${schoolData.name}:`, error);
                    continue;
                }
                if (newSchool) schoolId = newSchool.id;
            }

            if (!schoolId) continue;

            // Fetch existing departments
            const { data: existingDepts } = await supabase.from('departments').select('*').eq('school_id', schoolId);

            for (const deptName of schoolData.departments) {
                const existingDept = existingDepts?.find(d => d.name === deptName);

                if (!existingDept) {
                    const code = deptName.substring(0, 3).toUpperCase();
                    const { error: deptError } = await supabase
                        .from('departments')
                        .insert({ school_id: schoolId, name: deptName, code: code });

                    if (deptError) {
                        console.error(`Error inserting dept ${deptName}:`, deptError);
                    } else {
                        console.log(`  Inserted Department: ${deptName}`);
                    }
                }
            }
        }

    } catch (error) {
        console.error('Seed error:', error);
    }

    console.log('Seed update complete.');
}

seed();
