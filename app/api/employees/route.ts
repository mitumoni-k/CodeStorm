import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Employee } from "@/lib/models"

export async function GET() {
  try {
    const db = await getDatabase()
    const employees = await db.collection<Employee>("employees").find({}).toArray()

    return NextResponse.json({ employees })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeeData = await request.json()
    const db = await getDatabase()

    const newEmployee: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Employee>("employees").insertOne(newEmployee)

    return NextResponse.json({ employee: { ...newEmployee, _id: result.insertedId } })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
