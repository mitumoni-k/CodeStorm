import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Project } from "@/lib/models"

export async function GET() {
  try {
    const db = await getDatabase()
    const projects = await db.collection<Project>("projects").find({}).toArray()

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()
    const db = await getDatabase()

    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Project>("projects").insertOne(newProject)

    return NextResponse.json({ project: { ...newProject, _id: result.insertedId } })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
