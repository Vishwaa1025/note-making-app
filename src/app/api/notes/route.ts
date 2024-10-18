import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Adjust the import path based on your project structure

export async function GET() {
  try {
    // Fetch all notes from the database
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' }, // Sort notes by the most recent first
    });

    // Return the fetched notes as a JSON response with status 200
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);

    // Return an error message with status 500 in case of any issues
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
