"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOwnerById, updateOwner } from "@/lib/api/owner/OwnerController";
import type { UpdateOwnerRequest } from "@/lib/types/api";
import { OwnerForm } from "@/lib/components/owners/OwnerForm";
import { Button } from "@/lib/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";

export default function EditOwnerPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = Number(params.id);
  const [owner, setOwner] = useState<{
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    telephone: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadOwner() {
    setLoading(true);
    try {
      const data = await getOwnerById(ownerId);
      setOwner({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        telephone: data.telephone ?? "",
      });
    } catch (err) {
      toast.error("Failed to load owner");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    telephone: string;
  }) {
    try {
      const request: UpdateOwnerRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address || undefined,
        city: data.city || undefined,
        telephone: data.telephone || undefined,
      };
      await updateOwner(ownerId, request);
      toast.success("Owner updated successfully");
      router.push(`/owners/${ownerId}`);
    } catch (err) {
      toast.error("Failed to update owner");
      console.error(err);
    }
  }

  useEffect(() => {
    if (ownerId) loadOwner();
  }, [ownerId]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" href={`/owners/${ownerId}`} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Owner
      </Button>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading owner...</p>
        </div>
      ) : !owner ? (
        <div className="card p-12 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Owner not found</p>
        </div>
      ) : (
        <OwnerForm
          initialData={owner}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isEdit
        />
      )}
    </div>
  );
}
