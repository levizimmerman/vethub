"use client";

import { useEffect, useState, useMemo } from "react";
import { getVisits } from "@/lib/api/visit/VisitController";
import type { VisitResponse } from "@/lib/types/api";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Calendar, Search, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function VisitsPage() {
  const [visits, setVisits] = useState<VisitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVisits = useMemo(
    () =>
      visits.filter(
        (visit) =>
          visit.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          visit.date.includes(searchQuery)
      ),
    [visits, searchQuery]
  );

  async function loadVisits() {
    setLoading(true);
    try {
      const data = await getVisits();
      setVisits(data);
    } catch (err) {
      toast.error("Failed to load visits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Visits</h1>
        </div>
        <p className="text-muted-foreground">
          View all veterinary visits across all pets
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by description or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : visits.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No visits yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Visits will appear here once they are recorded for pets.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Pet ID</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No visits match your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">
                        {new Date(visit.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{visit.description}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          Pet #{visit.petId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          title="View pet details (link from owner)"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredVisits.length} of {visits.length} visits
          </p>
        </>
      )}
    </div>
  );
}
