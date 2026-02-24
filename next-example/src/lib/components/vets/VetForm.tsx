"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Badge } from "@/lib/components/ui/badge";
import type { SpecialtyResponse } from "@/lib/types/api";

interface VetFormProps {
  firstName?: string;
  lastName?: string;
  selectedSpecialtyIds?: number[];
  specialties: SpecialtyResponse[];
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    specialtyIds: number[];
  }) => Promise<void>;
  submitLabel?: string;
}

export function VetForm({
  firstName: initialFirstName = "",
  lastName: initialLastName = "",
  selectedSpecialtyIds: initialSpecialtyIds = [],
  specialties,
  onSubmit,
  submitLabel = "Save",
}: VetFormProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [selectedIds, setSelectedIds] = useState<number[]>([...initialSpecialtyIds]);
  const [submitting, setSubmitting] = useState(false);

  const selectedSpecialties = specialties.filter((s) => selectedIds.includes(s.id));
  const availableSpecialties = specialties.filter((s) => !selectedIds.includes(s.id));

  function addSpecialty(id: number) {
    if (!selectedIds.includes(id)) setSelectedIds((prev) => [...prev, id]);
  }

  function removeSpecialty(id: number) {
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        specialtyIds: selectedIds,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            required
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            required
            disabled={submitting}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Specialties</Label>
        {selectedSpecialties.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedSpecialties.map((specialty) => (
              <Badge key={specialty.id} variant="secondary" className="gap-1 pr-1">
                {specialty.name}
                <button
                  type="button"
                  onClick={() => removeSpecialty(specialty.id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  disabled={submitting}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {availableSpecialties.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableSpecialties.map((specialty) => (
              <button
                key={specialty.id}
                type="button"
                onClick={() => addSpecialty(specialty.id)}
                disabled={submitting}
                className="inline-flex items-center rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                + {specialty.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {specialties.length > 0 ? "All specialties selected" : "No specialties available"}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" href="/vets" disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
