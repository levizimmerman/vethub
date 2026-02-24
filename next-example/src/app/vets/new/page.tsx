"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getSpecialties } from "@/lib/api/specialty/SpecialtyController";
import { createVet } from "@/lib/api/vet/VetController";
import { VetForm } from "@/lib/components/vets/VetForm";
import { Button } from "@/lib/components/ui/button";
import { toast } from "sonner";

export default function NewVetPage() {
  const router = useRouter();
  const [specialties, setSpecialties] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpecialties()
      .then(setSpecialties)
      .catch(() => toast.error("Failed to load specialties"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(data: {
    firstName: string;
    lastName: string;
    specialtyIds: number[];
  }) {
    try {
      const vet = await createVet(data);
      toast.success("Veterinarian created successfully");
      router.push(`/vets/${vet.id}`);
    } catch (err) {
      toast.error("Failed to create veterinarian");
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" href="/vets" className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Veterinarians
      </Button>
      {loading ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <VetForm
          specialties={specialties}
          onSubmit={handleSubmit}
          submitLabel="Create Veterinarian"
        />
      )}
    </div>
  );
}
