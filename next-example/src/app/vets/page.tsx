"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getVets } from "@/lib/api/vet/VetController";
import type { VetResponse } from "@/lib/types/api";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Badge } from "@/lib/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Stethoscope, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function VetsPage() {
  const [vets, setVets] = useState<VetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVets = useMemo(() => {
    if (!searchQuery.trim()) return vets;
    const q = searchQuery.toLowerCase();
    return vets.filter(
      (vet) =>
        vet.firstName?.toLowerCase().includes(q) ||
        vet.lastName?.toLowerCase().includes(q) ||
        vet.specialties?.some((s) => s.name?.toLowerCase().includes(q))
    );
  }, [vets, searchQuery]);

  async function loadVets() {
    setLoading(true);
    try {
      const data = await getVets();
      setVets(data);
    } catch (err) {
      toast.error("Failed to load veterinarians");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVets();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <Stethoscope className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Veterinarians
            </h1>
            <p className="text-sm text-muted-foreground">
              Our team of veterinary specialists
            </p>
          </div>
        </div>
        <Button href="/vets/new" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Veterinarian
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading veterinarians...</p>
        </div>
      ) : filteredVets.length === 0 ? (
        <div className="card p-12 text-center">
          <Stethoscope className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          {searchQuery ? (
            <p className="text-muted-foreground">
              No veterinarians found matching &quot;{searchQuery}&quot;
            </p>
          ) : (
            <p className="text-muted-foreground">
              No veterinarians registered yet
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVets.map((vet) => (
                  <TableRow key={vet.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/vets/${vet.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        Dr. {vet.firstName} {vet.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(vet.specialties ?? []).map((s) => (
                          <Badge key={s.id} variant="outline" className="text-xs">
                            {s.name}
                          </Badge>
                        ))}
                        {!vet.specialties?.length && (
                          <span className="text-sm text-muted-foreground">
                            General Practice
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" href={`/vets/${vet.id}`}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredVets.length} of {vets.length} veterinarians
          </p>
        </>
      )}
    </div>
  );
}
