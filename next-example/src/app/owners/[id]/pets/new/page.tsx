"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getPetTypes } from "@/lib/api/pet-type/PetTypeController";
import { createPetForOwner } from "@/lib/api/pet/PetController";
import { PetForm } from "@/lib/components/pets/PetForm";
import { Button } from "@/lib/components/ui/button";
import { toast } from "sonner";

export default function NewPetPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = Number(params.id);
  const [petTypes, setPetTypes] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPetTypes()
      .then(setPetTypes)
      .catch(() => toast.error("Failed to load pet types"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(data: {
    name: string;
    birthDate: string;
    typeId: number;
  }) {
    try {
      await createPetForOwner(ownerId, data);
      toast.success("Pet created successfully");
      router.push(`/owners/${ownerId}`);
    } catch (err) {
      toast.error("Failed to create pet");
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button
        variant="ghost"
        href={`/owners/${ownerId}`}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Owner
      </Button>
      {loading ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <PetForm
          petTypes={petTypes}
          onSubmit={handleSubmit}
          submitLabel="Add Pet"
        />
      )}
    </div>
  );
}
