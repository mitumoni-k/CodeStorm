"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Domain {
  id: string
  name: string
  description: string
  skills: string[]
  color: string
}

export interface Team {
  name: string
  description: string
  domains: Domain[]
}

export interface TaskCategorization {
  taskId: string
  teamKey: string
  domainId: string
  matchScore: number
  matchedSkills: string[]
}

interface TeamState {
  teams: Record<string, Team>
  taskCategorizations: TaskCategorization[]

  // Team/Domain management
  addDomain: (teamKey: string, domain: Domain) => void
  updateDomain: (teamKey: string, domainId: string, updates: Partial<Domain>) => void
  deleteDomain: (teamKey: string, domainId: string) => void

  // Task categorization
  categorizeTask: (taskId: string, requiredSkills: string[]) => TaskCategorization | null
  getTasksForDomain: (teamKey: string, domainId: string) => string[]
  getTaskCategorization: (taskId: string) => TaskCategorization | null
}

const initialTeams = {
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
        skills: [
          "Node.js",
          "Python",
          "Java",
          "PostgreSQL",
          "MongoDB",
          "Docker",
          "AWS",
          "GraphQL",
          "Authentication",
          "JWT",
          "API Design",
        ],
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

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: initialTeams,
      taskCategorizations: [],

      addDomain: (teamKey, domain) => {
        set((state) => ({
          teams: {
            ...state.teams,
            [teamKey]: {
              ...state.teams[teamKey],
              domains: [...state.teams[teamKey].domains, domain],
            },
          },
        }))
      },

      updateDomain: (teamKey, domainId, updates) => {
        set((state) => ({
          teams: {
            ...state.teams,
            [teamKey]: {
              ...state.teams[teamKey],
              domains: state.teams[teamKey].domains.map((domain) =>
                domain.id === domainId ? { ...domain, ...updates } : domain,
              ),
            },
          },
        }))
      },

      deleteDomain: (teamKey, domainId) => {
        set((state) => ({
          teams: {
            ...state.teams,
            [teamKey]: {
              ...state.teams[teamKey],
              domains: state.teams[teamKey].domains.filter((domain) => domain.id !== domainId),
            },
          },
        }))
      },

      categorizeTask: (taskId, requiredSkills) => {
        const { teams } = get()
        let bestMatch: TaskCategorization | null = null
        let highestScore = 0

        // Iterate through all teams and domains to find the best match
        Object.entries(teams).forEach(([teamKey, team]) => {
          team.domains.forEach((domain) => {
            const matchedSkills = requiredSkills.filter((skill) =>
              domain.skills.some(
                (domainSkill) =>
                  domainSkill.toLowerCase().includes(skill.toLowerCase()) ||
                  skill.toLowerCase().includes(domainSkill.toLowerCase()),
              ),
            )

            const matchScore = matchedSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 0

            if (matchScore > highestScore) {
              highestScore = matchScore
              bestMatch = {
                taskId,
                teamKey,
                domainId: domain.id,
                matchScore: Math.round(matchScore),
                matchedSkills,
              }
            }
          })
        })

        // Only categorize if we have a decent match (>30%)
        if (bestMatch && bestMatch.matchScore > 30) {
          set((state) => ({
            taskCategorizations: [...state.taskCategorizations.filter((cat) => cat.taskId !== taskId), bestMatch!],
          }))
          return bestMatch
        }

        return null
      },

      getTasksForDomain: (teamKey, domainId) => {
        const { taskCategorizations } = get()
        return taskCategorizations
          .filter((cat) => cat.teamKey === teamKey && cat.domainId === domainId)
          .map((cat) => cat.taskId)
      },

      getTaskCategorization: (taskId) => {
        const { taskCategorizations } = get()
        return taskCategorizations.find((cat) => cat.taskId === taskId) || null
      },
    }),
    {
      name: "team-structure-storage",
    },
  ),
)
