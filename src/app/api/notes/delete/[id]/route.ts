// app/api/notes/delete/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Adjust to your Prisma client location

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const noteId = parseInt(params.id);

    // Fetch the current note before deleting it
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { versions: true }, // Include the versions of the note
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Create a note version to store the state before deletion
    await prisma.noteVersion.create({
      data: {
        title: note.title,
        content: note.content,
        version: note.versions.length + 1, // Increment version number
        action: "delete",
        noteId: note.id,
        userId: note.userId, // User who originally created the note
      },
    });

    // Delete the note
    const deletedNote = await prisma.note.delete({
      where: { id: noteId },
    });

    // Log the deletion action in the audit log
    await prisma.auditLog.create({
      data: {
        action: `Note deleted by user ${note.userId}`, // Customize action message
        userId: note.userId,
        noteId: note.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
