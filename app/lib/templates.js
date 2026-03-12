// Resume type definitions — each type maps to visible form/preview sections

export const TEMPLATES = {
  general: {
    label: 'General (ATS Classic)',
    description: 'Standard resume for most job applications',
    sections: ['experience', 'education', 'technicalSkills', 'softSkills', 'additionalSkills', 'languages', 'certifications'],
  },
  softwareDeveloper: {
    label: 'Software Developer',
    description: 'Highlights projects and technical skills',
    sections: ['experience', 'projects', 'technicalSkills', 'softSkills', 'education', 'certifications'],
  },
  marketing: {
    label: 'Marketing',
    description: 'Showcases campaigns and portfolio',
    sections: ['experience', 'campaigns', 'technicalSkills', 'softSkills', 'portfolioLinks', 'education'],
  },
  dataScience: {
    label: 'Data Science',
    description: 'Focuses on research and publications',
    sections: ['experience', 'projects', 'technicalSkills', 'publications', 'education', 'certifications'],
  },
  productManager: {
    label: 'Product Manager',
    description: 'Emphasizes achievements and leadership',
    sections: ['experience', 'achievements', 'technicalSkills', 'softSkills', 'education', 'certifications'],
  },
};

// Human-readable labels for each section key
export const SECTION_LABELS = {
  experience: 'Work Experience',
  education: 'Education',
  technicalSkills: 'Technical Skills',
  softSkills: 'Soft Skills',
  additionalSkills: 'Additional Skills',
  languages: 'Languages',
  certifications: 'Certifications',
  projects: 'Projects',
  campaigns: 'Campaigns',
  portfolioLinks: 'Portfolio Links',
  publications: 'Publications',
  achievements: 'Achievements',
};
