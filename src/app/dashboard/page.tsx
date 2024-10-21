'use client';

import Link from "next/link";
import { Bell, CircleUser, Home, Menu, Star, FileText, Archive, Bookmark, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddNoteModal from "@/components/AddNoteModal";
import EditNoteForm from "@/components/EditNoteForm"; // Import the EditNoteForm component
import VersionHistoryModal from "@/components/VersionHistory"; // Import VersionHistoryModal
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import NoteCard from "@/components/NotesDisplay"; // Import the NoteCard component
import ReadOnlyNoteCard from "@/components/ReadOnlyCard"; // Import the ReadOnlyNoteCard component

// Sample note data type
interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  isStarred: boolean;
  isImportant: boolean;
  isArchived: boolean;
}

export interface NoteVersion {
  id: number;
  version: number;
  title: string;
  content: string;
  action: string; // "update" or "delete"
  createdAt: string; // Timestamp for when the version was created
}

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for Add Note Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit Note Modal
  const [isReadOnlyCardOpen, setIsReadOnlyCardOpen] = useState(false); // State for ReadOnlyNoteCard
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false); // State for Version History Modal
  const [notes, setNotes] = useState<Note[]>([]); // State for storing notes
  const [selectedNote, setSelectedNote] = useState<Note | null>(null); // State for viewing a single note
  const [editingNote, setEditingNote] = useState<Note | null>(null); // State for the note being edited
  const [versions, setVersions] = useState<NoteVersion[]>([]); // State for note versions

  useEffect(() => {
    fetchNotes(); // Fetch notes on component mount
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes"); // Adjust the API endpoint
      if (response.ok) {
        const data = await response.json();
        setNotes(data); // Update state with fetched notes
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const openAddNoteModal = () => {
    setIsModalOpen(true);
    setIsReadOnlyCardOpen(false); // Ensure ReadOnlyCard is closed
  };

  const closeAddNoteModal = () => setIsModalOpen(false);

  const handleViewNote = (note: Note) => {
    setSelectedNote(note); // Set the selected note for read-only view
    setIsReadOnlyCardOpen(true); // Open the ReadOnlyCard modal
    setIsModalOpen(false); // Ensure Add Note modal is closed
  };

  const handleBackToNotes = () => {
    setSelectedNote(null); // Go back to the note list
    setIsReadOnlyCardOpen(false); // Close the ReadOnlyCard modal
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await fetch(`/api/notes/delete/${noteId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        fetchNotes(); // This ensures the local state is updated
      } else {
        console.error("Failed to delete the note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note); // Set the note to be edited
    setIsEditModalOpen(true); // Open the edit modal
  };

  const closeEditModal = () => {
    setEditingNote(null); // Reset the note being edited
    setIsEditModalOpen(false); // Close the edit modal
  };

  const handleNoteUpdate = (updatedNote: Note) => {
    setNotes(prevNotes =>
      prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note)
    );
    closeEditModal(); // Close the edit modal after updating the note
  };

  const handleViewVersionHistory = async (note: Note) => {
    setSelectedNote(note);
    setIsVersionHistoryOpen(true);

    try {
      const response = await fetch(`/api/notes/${note.id}/versions`);
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      } else {
        console.error("Failed to fetch version history");
      }
    } catch (error) {
      console.error("Error fetching version history:", error);
    }
  };

  const closeVersionHistory = () => {
    setIsVersionHistoryOpen(false);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Logo and Notification Button */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <FileText className="h-6 w-6" />
              <span className="">My Notes</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
              <ModeToggle />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Home className="h-4 w-4" />
                All Notes
              </Link>
              <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Star className="h-4 w-4" />
                Starred
              </Link>
              <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Bookmark className="h-4 w-4" />
                Important
              </Link>
              <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Archive className="h-4 w-4" />
                Archived
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="h-6 w-6" />
                  <span className="sr-only">My Notes</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <Home className="h-4 w-4" />
                  All Notes
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <Star className="h-4 w-4" />
                  Starred
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search Bar */}
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search notes..." className="w-full bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3" />
              </div>
            </form>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">All Notes</h1>
          </div>

          {/* Notes Display or Fallback */}
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => handleDeleteNote(note.id)}
                  onView={() => handleViewNote(note)}
                  onViewVersionHistory={() => handleViewVersionHistory(note)} // Trigger version history
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">You have no notes. Start creating your first note!</p>
                <Button className="mt-4" onClick={openAddNoteModal}> {/* Fixed reference to openAddNoteModal */}
                  Add Note
                </Button>
              </div>
            </div>
          )}

          {/* AddNoteModal Component */}
          <AddNoteModal isOpen={isModalOpen} closeModal={closeAddNoteModal} setNotes={setNotes} />

          {/* EditNoteModal Component */}
          {editingNote && (
            <EditNoteForm
              isOpen={isEditModalOpen}
              note={editingNote}
              closeModal={closeEditModal}
              handleNoteUpdate={handleNoteUpdate}
            />
          )}

          {/* View Selected Note in ReadOnly Mode */}
          {selectedNote && isReadOnlyCardOpen && (
            <ReadOnlyNoteCard 
              title={selectedNote.title} 
              content={selectedNote.content} 
              date={selectedNote.date} 
              onBack={handleBackToNotes} 
              isOpen={isReadOnlyCardOpen} // Ensure modal visibility is controlled properly
            />
          )}

          {/* VersionHistoryModal Component */}
          {selectedNote && isVersionHistoryOpen && (
            <VersionHistoryModal
              versions={versions}
              onBack={closeVersionHistory}
              isOpen={isVersionHistoryOpen}
            />
          )}
        </main>
      </div>

      {/* Floating Add Note Button (if needed) */}
      <Button className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg" onClick={openAddNoteModal}>
        Add Note
      </Button>
    </div>
  );
}
