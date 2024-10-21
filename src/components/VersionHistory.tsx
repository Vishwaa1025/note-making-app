"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components
import { ArrowLeft } from "lucide-react";
import { NoteVersion } from "../app/dashboard/page"; 

interface VersionHistoryProps {
  isOpen: boolean; // Control whether the modal is open or closed
  onBack: () => void; // Function to close the modal
  versions: NoteVersion[]; // List of note versions
}

export default function VersionHistory({ isOpen, onBack, versions }: VersionHistoryProps) {
  // Sort the versions to display them in ascending order (1, 2, 3...)
  const sortedVersions = versions.slice().sort((a, b) => a.version - b.version);

  return (
    <Dialog open={isOpen} onOpenChange={onBack}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Table>
            <TableCaption className="text-muted-foreground">
              A list of all versions for this note.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-foreground">Version</TableHead>
                <TableHead className="text-foreground">Title</TableHead>
                <TableHead className="text-foreground">Action</TableHead>
                <TableHead className="text-right text-foreground">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVersions.map((version) => (
                <TableRow key={version.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{version.version}</TableCell>
                  <TableCell>{version.title}</TableCell>
                  <TableCell className="capitalize">{version.action}</TableCell>
                  <TableCell className="text-right">
                    {new Date(version.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-right">
                  Total Versions: {sortedVersions.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
