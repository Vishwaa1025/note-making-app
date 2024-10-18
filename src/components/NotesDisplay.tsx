'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star, Bookmark, Archive } from 'lucide-react';

export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  isStarred: boolean;
  isImportant: boolean;
  isArchived: boolean;
}

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export default function NoteCard({ note, onEdit, onDelete, onView }: NoteCardProps) {
  return (
    <Card className="w-full max-w-sm p-6 rounded-lg shadow-lg">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="text-xl font-bold">{note.title}</CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{note.date}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-gray-700 dark:text-gray-300">
        <p>{note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="ghost" onClick={onView}>
          View
        </Button>
        <div className="flex gap-2">
          {note.isStarred && (
            <Badge className="bg-[#FFD700] text-black">
              <Star className="h-4 w-4 mr-1" /> Starred
            </Badge>
          )}
          {note.isImportant && (
            <Badge className="bg-[#FF4500] text-white">
              <Bookmark className="h-4 w-4 mr-1" /> Important
            </Badge>
          )}
          {note.isArchived && (
            <Badge className="bg-[#0ADD08] text-white">
              <Archive className="h-4 w-4 mr-1" /> Archived
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
