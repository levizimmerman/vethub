"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createOwner } from "@/lib/api/owner/OwnerController";
import type { CreateOwnerRequest } from "@/lib/types/api";
import { OwnerForm } from "@/lib/components/owners/OwnerForm";
import { Button } from "@/lib/components/ui/button";
import { toast } from "sonner";

export default function NewOwnerPage() {
  const router = useRouter();

  async function handleSubmit(data: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    telephone: string;
  }) {
    try {
      const request: CreateOwnerRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address || undefined,
        city: data.city || undefined,
        telephone: data.telephone || undefined,
      };
      const owner = await createOwner(request);
      toast.success("Owner created successfully");
      router.push(`/owners/${owner.id}`);
    } catch (err) {
      toast.error("Failed to create owner");
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" href="/owners" className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Owners
      </Button>
      <OwnerForm onSubmit={handleSubmit} submitLabel="Create Owner" />
    </div>
  );
}
