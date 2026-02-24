"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getOwners } from "@/lib/api/owner/OwnerController";
import type { OwnerResponse } from "@/lib/types/api";
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
import { Users, Plus, Search, Phone, MapPin, PawPrint } from "lucide-react";
import { toast } from "sonner";

export default function OwnersPage() {
  const [owners, setOwners] = useState<OwnerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOwners = useMemo(() => {
    if (!searchQuery.trim()) return owners;
    const q = searchQuery.toLowerCase();
    return owners.filter(
      (owner) =>
        owner.firstName?.toLowerCase().includes(q) ||
        owner.lastName?.toLowerCase().includes(q) ||
        owner.city?.toLowerCase().includes(q) ||
        owner.pets?.some((pet) => pet.name?.toLowerCase().includes(q))
    );
  }, [owners, searchQuery]);

  async function loadOwners() {
    setLoading(true);
    try {
      const data = await getOwners();
      setOwners(data);
    } catch (err) {
      toast.error("Failed to load owners");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOwners();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pet Owners</h1>
            <p className="text-sm text-muted-foreground">
              Manage pet owner information
            </p>
          </div>
        </div>
        <Button href="/owners/new" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Owner
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, city, or pet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading owners...</p>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          {searchQuery ? (
            <p className="text-muted-foreground">
              No owners found matching &quot;{searchQuery}&quot;
            </p>
          ) : (
            <p className="text-muted-foreground">No owners registered yet</p>
          )}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Pets</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.map((owner) => (
                  <TableRow key={owner.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/owners/${owner.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {owner.firstName} {owner.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {owner.telephone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {owner.city}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(owner.pets ?? []).map((pet) => (
                          <Badge key={pet.id} variant="secondary" className="gap-1">
                            <PawPrint className="h-3 w-3" />
                            {pet.name}
                          </Badge>
                        ))}
                        {!owner.pets?.length && (
                          <span className="text-sm text-muted-foreground">
                            No pets
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" href={`/owners/${owner.id}`}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredOwners.length} of {owners.length} owners
          </p>
        </>
      )}
    </div>
  );
}
