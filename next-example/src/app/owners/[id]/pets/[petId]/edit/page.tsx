"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, PawPrint } from "lucide-react";
import { getPetForOwner, updatePetForOwner } from "@/lib/api/pet/PetController";
import { getPetTypes } from "@/lib/api/pet-type/PetTypeController";
import type { PetTypeResponse } from "@/lib/types/api";
import { PetForm } from "@/lib/components/pets/PetForm";
import { Button } from "@/lib/components/ui/button";
import { toast } from "sonner";

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = Number(params.id);
  const petId = Number(params.petId);
  const [petTypes, setPetTypes] = useState<PetTypeResponse[]>([]);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [typeId, setTypeId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPetTypes(), getPetForOwner(ownerId, petId)])
      .then(([types, pet]) => {
        setPetTypes(types);
        setName(pet.name);
        setBirthDate(pet.birthDate);
        setTypeId(pet.type?.id);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, [ownerId, petId]);

  async function handleSubmit(data: {
    name: string;
    birthDate: string;
    typeId: number;
  }) {
    try {
      await updatePetForOwner(ownerId, petId, data);
      toast.success("Pet updated successfully");
      router.push(`/owners/${ownerId}/pets/${petId}`);
    } catch (err) {
      toast.error("Failed to update pet");
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button
        variant="ghost"
        href={`/owners/${ownerId}/pets/${petId}`}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pet
      </Button>
      {loading ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <PetForm
          name={name}
          birthDate={birthDate}
          typeId={typeId}
          petTypes={petTypes}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
