"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getVetById, updateVet } from "@/lib/api/vet/VetController";
import { getSpecialties } from "@/lib/api/specialty/SpecialtyController";
import { VetForm } from "@/lib/components/vets/VetForm";
import { Button } from "@/lib/components/ui/button";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { toast } from "sonner";

export default function EditVetPage() {
  const params = useParams();
  const router = useRouter();
  const vetId = Number(params.id);
  const [specialties, setSpecialties] = useState<{ id: number; name: string }[]>(
    []
  );
  const [vet, setVet] = useState<{
    firstName: string;
    lastName: string;
    specialtyIds: number[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSpecialties(), getVetById(vetId)])
      .then(([specs, v]) => {
        setSpecialties(specs);
        setVet({
          firstName: v.firstName,
          lastName: v.lastName,
          specialtyIds: (v.specialties ?? []).map((s) => s.id),
        });
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, [vetId]);

  async function handleSubmit(data: {
    firstName: string;
    lastName: string;
    specialtyIds: number[];
  }) {
    try {
      await updateVet(vetId, data);
      toast.success("Veterinarian updated successfully");
      router.push(`/vets/${vetId}`);
    } catch (err) {
      toast.error("Failed to update veterinarian");
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" href={`/vets/${vetId}`} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Veterinarian
      </Button>
      {loading ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : !vet ? (
        <div className="card p-12 text-center">
          <Stethoscope className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Veterinarian not found</p>
        </div>
      ) : (
        <VetForm
          firstName={vet.firstName}
          lastName={vet.lastName}
          selectedSpecialtyIds={vet.specialtyIds}
          specialties={specialties}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
