// app/api/notes/[id]/versions/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Adjust to your Prisma client location

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const noteId = parseInt(params.id);

    // Fetch all versions for the note
    const versions = await prisma.noteVersion.findMany({
      where: { noteId },
      orderBy: { createdAt: 'desc' }, // Sort by the latest version first
    });

    return NextResponse.json(versions, { status: 200 });
  } catch (error) {
    console.error("Error fetching note versions:", error);
    return NextResponse.json({ error: "Failed to fetch note versions" }, { status: 500 });
  }
}
