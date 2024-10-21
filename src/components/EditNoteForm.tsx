"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, AlertTriangle, Archive } from "lucide-react";
import { Note } from "./NotesDisplay";

interface EditNoteModalProps {
  isOpen: boolean;
  closeModal: () => void;
  note: Note; // Existing note passed for editing
  handleNoteUpdate: (updatedNote: Note) => void; // Handle note update
}

export default function EditNoteModal({ isOpen, closeModal, note, handleNoteUpdate }: EditNoteModalProps) {
  const [updatedNote, setUpdatedNote] = useState<{
    title: string;
    description: string;
    selectedBadge: "isStarred" | "isImportant" | "isArchived" | null;
  }>({
    title: note.title,
    description: note.content,
    selectedBadge: note.isStarred
      ? "isStarred"
      : note.isImportant
      ? "isImportant"
      : note.isArchived
      ? "isArchived"
      : null,
  });

  useEffect(() => {
    setUpdatedNote({
      title: note.title,
      description: note.content,
      selectedBadge: note.isStarred
        ? "isStarred"
        : note.isImportant
        ? "isImportant"
        : note.isArchived
        ? "isArchived"
        : null,
    });
  }, [note]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleBadgeSelect = (field: "isStarred" | "isImportant" | "isArchived") => {
    setUpdatedNote((prevNote) => ({ ...prevNote, selectedBadge: field }));
  };

  const handleUpdateNote = async (e: FormEvent) => {
    e.preventDefault();

    if (updatedNote.title.trim() !== "") {
      try {
        const response = await fetch(`/api/notes/update/${note.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedNote.title,
            content: updatedNote.description,
            isStarred: updatedNote.selectedBadge === "isStarred",
            isImportant: updatedNote.selectedBadge === "isImportant",
            isArchived: updatedNote.selectedBadge === "isArchived",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          handleNoteUpdate(data);

          // Show toast notification using Sonner
          toast("Note Updated", {
            description: `Title: ${updatedNote.title}`,
          });

          closeModal();
        } else {
          const errorData = await response.json();
          toast("Error", { description: errorData.error });
        }
      } catch (error) {
        console.error("Error updating note:", error);
        toast("Error", { description: "Failed to update note" });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateNote} className="grid gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter a title"
              value={updatedNote.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Edit your notes here..."
              value={updatedNote.description}
              onChange={handleInputChange}
              className="mw-full min-h-[400px] max-h-[600px]"
              required
            />
          </div>

          {/* Badges for Starred, Important, and Archived */}
          <div className="flex gap-2">
            <Badge
              className={`cursor-pointer transition-colors ${
                updatedNote.selectedBadge === "isStarred"
                  ? "bg-[#FFD700] text-black"
                  : "bg-muted text-muted-foreground hover:bg-[#FFEA3D] hover:text-black"
              }`}
              onClick={() => handleBadgeSelect("isStarred")}
            >
              <Star className="inline h-4 w-4 mr-1" />
              Starred
            </Badge>

            <Badge
              className={`cursor-pointer transition-colors ${
                updatedNote.selectedBadge === "isImportant"
                  ? "bg-[#FF4500] text-white"
                  : "bg-muted text-muted-foreground hover:bg-[#FF6347] hover:text-white"
              }`}
              onClick={() => handleBadgeSelect("isImportant")}
            >
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              Important
            </Badge>

            <Badge
              className={`cursor-pointer transition-colors ${
                updatedNote.selectedBadge === "isArchived"
                  ? "bg-[#0ADD08] text-white"
                  : "bg-muted text-muted-foreground hover:bg-[#0ADD08] hover:text-white"
              }`}
              onClick={() => handleBadgeSelect("isArchived")}
            >
              <Archive className="inline h-4 w-4 mr-1" />
              Archived
            </Badge>
          </div>

          <Button type="submit" className="mt-4">
            Update Note
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
