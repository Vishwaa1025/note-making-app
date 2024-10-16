// app/api/notes/create/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Adjust to your Prisma client location

export async function POST(req: Request) {
  try {
    const { title, content, isStarred, isImportant, isArchived, tags, userId } = await req.json();
    
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        isStarred: isStarred || false,
        isImportant: isImportant || false,
        isArchived: isArchived || false,
        tags: tags || [],
        userId,
      },
    });

    // Log the creation in the NoteVersion model
    await prisma.noteVersion.create({
      data: {
        title,
        content,
        version: 1,
        action: "create",
        noteId: newNote.id,
        userId: userId,
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
