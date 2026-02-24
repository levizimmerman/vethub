"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Select } from "@/lib/components/ui/select";
import type { PetTypeResponse } from "@/lib/types/api";

interface PetFormProps {
  name?: string;
  birthDate?: string;
  typeId?: number;
  petTypes: PetTypeResponse[];
  onSubmit: (data: {
    name: string;
    birthDate: string;
    typeId: number;
  }) => Promise<void>;
  submitLabel?: string;
}

export function PetForm({
  name: initialName = "",
  birthDate: initialBirthDate = "",
  typeId: initialTypeId,
  petTypes,
  onSubmit,
  submitLabel = "Save",
}: PetFormProps) {
  const [name, setName] = useState(initialName);
  const [birthDate, setBirthDate] = useState(initialBirthDate);
  const [selectedTypeId, setSelectedTypeId] = useState<number | undefined>(
    initialTypeId
  );
  const [submitting, setSubmitting] = useState(false);

  const options = petTypes.map((t) => ({ value: String(t.id), label: t.name }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedTypeId == null) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        birthDate,
        typeId: selectedTypeId,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Pet Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter pet name"
          required
          disabled={submitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="petType">Pet Type</Label>
        <Select
          id="petType"
          options={options}
          value={selectedTypeId != null ? String(selectedTypeId) : ""}
          onValueChange={(v) => setSelectedTypeId(v ? Number(v) : undefined)}
          placeholder="Select a pet type"
          disabled={submitting}
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || selectedTypeId == null}
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
