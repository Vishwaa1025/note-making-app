"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddNoteForm from "./AddNoteForm";

interface AddNoteModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddNoteModal({ isOpen, closeModal }: AddNoteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl w-full"> {/* This will make the modal wider */}
        <DialogHeader>
          <DialogTitle>Create a New Note</DialogTitle>
        </DialogHeader>
        {/* Note creation form */}
        <AddNoteForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
