"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, AlertTriangle, Archive } from "lucide-react";
import { Note } from "./NotesDisplay";

// Define the prop type for AddNoteForm
interface AddNoteFormProps {
  closeModal: () => void;
  handleNoteCreation: (newNote: Note) => void; // Accept the new note
}

export default function AddNoteForm({ closeModal, handleNoteCreation }: AddNoteFormProps) {
  const [newNote, setNewNote] = useState<{
    title: string;
    description: string;
    selectedBadge: "isStarred" | "isImportant" | "isArchived" | null;
  }>({
    title: "",
    description: "",
    selectedBadge: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleBadgeSelect = (field: "isStarred" | "isImportant" | "isArchived") => {
    setNewNote((prevNote) => ({ ...prevNote, selectedBadge: field }));
  };

  const handleSaveNote = async (e: FormEvent) => {
    e.preventDefault();

    if (newNote.title.trim() !== "") {
      try {
        // API call to create a new note
        const response = await fetch("/api/notes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newNote.title,
            content: newNote.description,
            isStarred: newNote.selectedBadge === "isStarred",
            isImportant: newNote.selectedBadge === "isImportant",
            isArchived: newNote.selectedBadge === "isArchived",
            userId: 1, // Replace with the actual user ID
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Call handleNoteCreation with the new note data
          handleNoteCreation(data);

          // Show toast notification using Sonner
          toast("Note Saved", {
            description: `Title: ${newNote.title}`,
            action: {
              label: "Undo",
              onClick: () => {
                console.log("Undo action clicked");
              },
            },
          });

          // Clear the form and close the modal after saving
          setNewNote({ title: "", description: "", selectedBadge: null });
        } else {
          const errorData = await response.json();
          toast("Error", { description: errorData.error });
        }
      } catch (error) {
        console.error("Error saving note:", error);
        toast("Error", { description: "Failed to save note" });
      }
    }
  };

  return (
    <form onSubmit={handleSaveNote} className="grid gap-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Enter a title"
          value={newNote.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Write your notes here..."
          value={newNote.description}
          onChange={handleInputChange}
          className="mw-full min-h-[400px] max-h-[600px]"
          required
        />
      </div>

      {/* Badges for Starred, Important, and Archived */}
      <div className="flex gap-2">
        <Badge
          className={`cursor-pointer transition-colors ${
            newNote.selectedBadge === "isStarred"
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
            newNote.selectedBadge === "isImportant"
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
            newNote.selectedBadge === "isArchived"
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
        Save Note
      </Button>
    </form>
  );
}
