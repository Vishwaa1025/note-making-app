"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, AlertTriangle, Archive } from "lucide-react";

// Define the prop type for AddNoteForm
interface AddNoteFormProps {
  closeModal: () => void; // This is the closeModal function passed from AddNoteModal
}

export default function AddNoteForm({ closeModal }: AddNoteFormProps) {
  const [newNote, setNewNote] = useState<{
    title: string;
    description: string;
    selectedBadge: "isStarred" | "isImportant" | "isArchived" | null;
  }>({
    title: "",
    description: "",
    selectedBadge: null, // Only one badge can be selected at a time
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleBadgeSelect = (field: "isStarred" | "isImportant" | "isArchived") => {
    setNewNote((prevNote) => ({ ...prevNote, selectedBadge: field })); // Only one badge selected
  };

  const handleSaveNote = (e: FormEvent) => {
    e.preventDefault();

    if (newNote.title.trim() !== "") {
      // Add logic to save the note (API call or state update)

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

      setNewNote({ title: "", description: "", selectedBadge: null });
      closeModal(); // Close the modal after saving the note
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
          className="mw-full min-h-[400px] max-h-[600px]" // Increased height for the text area
          required
        />
      </div>

      {/* Badges for Starred, Important, and Archived */}
      <div className="flex gap-2">
        <Badge
          className={`cursor-pointer transition-colors ${
            newNote.selectedBadge === "isStarred"
              ? "bg-[#FFD700] text-black" // Bright Gold when selected
              : "bg-muted text-muted-foreground hover:bg-[#FFEA3D] hover:text-black" // Lighter Gold on hover
          }`}
          onClick={() => handleBadgeSelect("isStarred")}
        >
          <Star className="inline h-4 w-4 mr-1" />
          Starred
        </Badge>

        <Badge
          className={`cursor-pointer transition-colors ${
            newNote.selectedBadge === "isImportant"
              ? "bg-[#FF4500] text-white" // Bright Red when selected
              : "bg-muted text-muted-foreground hover:bg-[#FF6347] hover:text-white" // Lighter Red on hover
          }`}
          onClick={() => handleBadgeSelect("isImportant")}
        >
          <AlertTriangle className="inline h-4 w-4 mr-1" />
          Important
        </Badge>

        <Badge
          className={`cursor-pointer transition-colors ${
            newNote.selectedBadge === "isArchived"
              ? "bg-[#0ADD08] text-white" // Bright Green when selected
              : "bg-muted text-muted-foreground hover:bg-[#0ADD08] hover:text-white" // Lighter Green on hover
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
