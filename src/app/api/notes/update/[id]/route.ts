import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Adjust to your Prisma client location
import jwt from 'jsonwebtoken'; // Import JWT library

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const noteId = parseInt(params.id, 10); // Ensure base 10 parsing
    const { title, content, isStarred, isImportant, isArchived } = await req.json();

    // Extract token from cookies
    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: "Authentication token missing" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Ensure JWT_SECRET is defined
    } catch (error) {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 });
    }

    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found in token" }, { status: 401 });
    }

    // Fetch the current note before updating it
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { versions: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Create a note version to store the state before updating
    await prisma.noteVersion.create({
      data: {
        title: note.title,
        content: note.content,
        version: note.versions.length + 1,
        action: "update",
        noteId: note.id,
        userId: userId,
      },
    });

    // Update the note with new values
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { title, content, isStarred, isImportant, isArchived },
    });

    // Log the update action in the audit log
    await prisma.auditLog.create({
      data: {
        action: `Note updated by user ${userId}`,
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
