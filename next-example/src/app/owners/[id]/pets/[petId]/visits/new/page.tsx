"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createVisitForPet } from "@/lib/api/visit/VisitController";
import { VisitForm } from "@/lib/components/visits/VisitForm";
import { Button } from "@/lib/components/ui/button";
import { toast } from "sonner";

export default function NewVisitPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = Number(params.id);
  const petId = Number(params.petId);

  async function handleSubmit(data: { date: string; description: string }) {
    try {
      await createVisitForPet(ownerId, petId, data);
      toast.success("Visit created successfully");
      router.push(`/owners/${ownerId}/pets/${petId}`);
    } catch (err) {
      toast.error("Failed to create visit");
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
      <VisitForm onSubmit={handleSubmit} submitLabel="Add Visit" />
    </div>
  );
}
