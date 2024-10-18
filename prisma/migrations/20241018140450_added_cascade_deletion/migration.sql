-- DropForeignKey
ALTER TABLE "NoteVersion" DROP CONSTRAINT "NoteVersion_noteId_fkey";

-- AddForeignKey
ALTER TABLE "NoteVersion" ADD CONSTRAINT "NoteVersion_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
