"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Ensure this is the correct import
import { Button } from "@/components/ui/button"; // Adjust import as per your UI library
import { ArrowLeft } from "lucide-react";

interface ReadOnlyNoteCardProps {
  title: string;
  content: string;
  date: string;
  onBack: () => void;
  isOpen: boolean; // Prop to control visibility
}

export default function ReadOnlyNoteCard({ title, content, date, onBack, isOpen }: ReadOnlyNoteCardProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onBack}> {/* Control the modal visibility */}
      <DialogContent className="max-w-lg w-full p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{date}</p>
        </DialogHeader>
        <div className="text-gray-700 dark:text-gray-300">
          <p>{content}</p>
        </div>
        <Button variant="ghost" onClick={onBack} className="text-blue-600 mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
