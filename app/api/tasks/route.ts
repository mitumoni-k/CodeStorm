import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Task } from "@/lib/models"

export async function GET() {
  try {
    const db = await getDatabase()
    const tasks = await db.collection<Task>("tasks").find({}).toArray()

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json()
    const db = await getDatabase()

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection<Task>("tasks").insertOne(newTask)

    return NextResponse.json({ task: { ...newTask, _id: result.insertedId } })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
