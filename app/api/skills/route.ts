import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Employee } from "@/lib/models"

export async function GET() {
  try {
    const db = await getDatabase()

    // Get all unique skills from employees
    const employees = await db.collection<Employee>("employees").find({}).toArray()
    const allSkills = employees.flatMap((emp) => emp.skills || [])
    const uniqueSkills = [...new Set(allSkills)].sort()

    // Add some common additional skills
    const additionalSkills = [
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Python",
      "Java",
      "C++",
      "C#",
      "HTML",
      "CSS",
      "Tailwind",
      "Bootstrap",
      "Vue.js",
      "Angular",
      "Svelte",
      "Express",
      "FastAPI",
      "Django",
      "Spring Boot",
      "ASP.NET",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "SQLite",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "GCP",
      "Terraform",
      "Git",
      "GitHub",
      "GitLab",
      "CI/CD",
      "Jenkins",
      "DevOps",
      "Figma",
      "Adobe XD",
      "Sketch",
      "Photoshop",
      "Illustrator",
      "UI Design",
      "UX Design",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Testing",
      "Jest",
      "Cypress",
      "Selenium",
      "Unit Testing",
      "Integration Testing",
      "Machine Learning",
      "Data Analysis",
      "Statistics",
      "Tableau",
      "Power BI",
      "Project Management",
      "Agile",
      "Scrum",
      "Kanban",
      "JIRA",
      "Confluence",
      "Technical Writing",
      "Documentation",
      "API Design",
      "REST",
      "GraphQL",
      "Security",
      "Authentication",
      "JWT",
      "OAuth",
      "OWASP",
      "Penetration Testing",
    ]

    const combinedSkills = [...new Set([...uniqueSkills, ...additionalSkills])].sort()

    return NextResponse.json({ skills: combinedSkills })
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}
