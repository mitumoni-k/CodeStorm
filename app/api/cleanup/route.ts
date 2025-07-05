import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Task } from "@/lib/models"

export async function POST() {
  try {
    const db = await getDatabase()
    const now = new Date().toISOString()

    // Find tasks that should be auto-deleted
    const tasksToDelete = await db
      .collection<Task>("tasks")
      .find({
        autoDeleteAt: { $lte: now },
      })
      .toArray()

    if (tasksToDelete.length > 0) {
      // Delete the tasks
      await db.collection<Task>("tasks").deleteMany({
        autoDeleteAt: { $lte: now },
      })

      return NextResponse.json({
        message: `Cleaned up ${tasksToDelete.length} completed tasks`,
        deletedTasks: tasksToDelete.length,
      })
    }

    return NextResponse.json({
      message: "No tasks to clean up",
      deletedTasks: 0,
    })
  } catch (error) {
    console.error("Error cleaning up tasks:", error)
    return NextResponse.json({ error: "Failed to cleanup tasks" }, { status: 500 })
  }
}
