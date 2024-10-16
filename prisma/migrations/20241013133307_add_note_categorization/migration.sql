-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isImportant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStarred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[];
