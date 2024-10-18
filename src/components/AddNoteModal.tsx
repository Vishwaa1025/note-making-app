"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddNoteForm from "./AddNoteForm";
import { Dispatch, SetStateAction } from 'react';
import { Note } from './NotesDisplay';

interface AddNoteModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setNotes: Dispatch<SetStateAction<Note[]>>;
}

export default function AddNoteModal({ isOpen, closeModal, setNotes }: AddNoteModalProps) {
  const handleNoteCreation = (newNote: Note) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]); // Update the list of notes with the new note
    closeModal(); // Close the modal after the note is created
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Create a New Note</DialogTitle>
        </DialogHeader>
        {/* Pass both handleNoteCreation and closeModal to AddNoteForm */}
        <AddNoteForm handleNoteCreation={handleNoteCreation} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
