// app/api/notes/update/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Adjust to your Prisma client location

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const noteId = parseInt(params.id);
    const { title, content, isStarred, isImportant, isArchived, userId } = await req.json();

    // Fetch the current note before updating it
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { versions: true }, // Include the versions of the note
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Create a note version to store the state before updating
    await prisma.noteVersion.create({
      data: {
        title: note.title,
        content: note.content,
        version: note.versions.length + 1, // Increment version number
        action: "update",
        noteId: note.id,
        userId: userId, // User who made the update
      },
    });

    // Update the note
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { title, content, isStarred, isImportant, isArchived },
    });

    // Log the update action in the audit log
    await prisma.auditLog.create({
      data: {
        action: `Note updated by user ${userId}`, // Customize action message
        userId: userId,
        noteId: note.id,
      },
    });

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}
