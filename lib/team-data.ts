export const teamStructure = {
  engineering: {
    name: "Engineering Team",
    description: "Software development and technical implementation",
    domains: [
      {
        id: "frontend",
        name: "Frontend Development",
        description: "User interface and user experience development",
        skills: ["React", "TypeScript", "CSS", "JavaScript", "Next.js", "Tailwind", "Vue.js", "Angular"],
        color: "bg-blue-100 text-blue-800",
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Server-side development and API design",
        skills: ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB", "Docker", "AWS", "GraphQL"],
        color: "bg-green-100 text-green-800",
      },
      {
        id: "devops",
        name: "DevOps & Infrastructure",
        description: "Deployment, monitoring, and infrastructure management",
        skills: ["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins", "Monitoring", "CI/CD"],
        color: "bg-purple-100 text-purple-800",
      },
      {
        id: "mobile",
        name: "Mobile Development",
        description: "iOS and Android application development",
        skills: ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android"],
        color: "bg-orange-100 text-orange-800",
      },
      {
        id: "qa",
        name: "Quality Assurance",
        description: "Testing and quality control",
        skills: ["Test Automation", "Selenium", "Jest", "Cypress", "Manual Testing", "API Testing"],
        color: "bg-red-100 text-red-800",
      },
    ],
  },
  design: {
    name: "Design Team",
    description: "User experience and visual design",
    domains: [
      {
        id: "ux",
        name: "UX Design",
        description: "User experience research and design",
        skills: ["User Research", "Wireframing", "Prototyping", "User Testing", "Information Architecture"],
        color: "bg-pink-100 text-pink-800",
      },
      {
        id: "ui",
        name: "UI Design",
        description: "Visual design and interface creation",
        skills: ["Figma", "Adobe XD", "Sketch", "Design Systems", "Visual Design", "Branding"],
        color: "bg-indigo-100 text-indigo-800",
      },
      {
        id: "graphic",
        name: "Graphic Design",
        description: "Marketing materials and brand assets",
        skills: ["Adobe Creative Suite", "Illustrator", "Photoshop", "Brand Design", "Print Design"],
        color: "bg-yellow-100 text-yellow-800",
      },
    ],
  },
  product: {
    name: "Product Team",
    description: "Product strategy and management",
    domains: [
      {
        id: "management",
        name: "Product Management",
        description: "Product strategy and roadmap planning",
        skills: ["Product Strategy", "Roadmapping", "Analytics", "User Stories", "Agile", "Scrum"],
        color: "bg-teal-100 text-teal-800",
      },
      {
        id: "marketing",
        name: "Product Marketing",
        description: "Go-to-market strategy and positioning",
        skills: ["Marketing Strategy", "Content Marketing", "SEO", "Social Media", "Campaign Management"],
        color: "bg-cyan-100 text-cyan-800",
      },
    ],
  },
  analytics: {
    name: "Analytics Team",
    description: "Data analysis and business intelligence",
    domains: [
      {
        id: "data-analysis",
        name: "Data Analysis",
        description: "Statistical analysis and insights generation",
        skills: ["Python", "R", "SQL", "Statistics", "Data Visualization", "Excel"],
        color: "bg-emerald-100 text-emerald-800",
      },
      {
        id: "business-intelligence",
        name: "Business Intelligence",
        description: "BI tools and dashboard creation",
        skills: ["Tableau", "Power BI", "Looker", "SQL", "Data Warehousing", "ETL"],
        color: "bg-violet-100 text-violet-800",
      },
      {
        id: "data-science",
        name: "Data Science",
        description: "Machine learning and predictive analytics",
        skills: ["Machine Learning", "Python", "TensorFlow", "Scikit-learn", "Deep Learning", "AI"],
        color: "bg-rose-100 text-rose-800",
      },
    ],
  },
}
