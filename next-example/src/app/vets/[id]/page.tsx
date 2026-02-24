"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getVetById, deleteVet as deleteVetApi } from "@/lib/api/vet/VetController";
import type { VetResponse } from "@/lib/types/api";
import { Button } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/lib/components/ui/card";
import { Stethoscope, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function VetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vetId = Number(params.id);
  const [vet, setVet] = useState<VetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  async function loadVet() {
    setLoading(true);
    try {
      const data = await getVetById(vetId);
      setVet(data);
    } catch (err) {
      toast.error("Failed to load veterinarian");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteVet() {
    if (!confirm("Are you sure you want to delete this veterinarian?")) return;
    setDeleting(true);
    try {
      await deleteVetApi(vetId);
      toast.success("Veterinarian deleted successfully");
      router.push("/vets");
    } catch (err) {
      toast.error("Failed to delete veterinarian");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (vetId) loadVet();
  }, [vetId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" href="/vets" className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Veterinarians
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
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <Stethoscope className="h-8 w-8 text-success" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Dr. {vet.firstName} {vet.lastName}
                  </CardTitle>
                  <CardDescription>Veterinarian</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  href={`/vets/${vetId}/edit`}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteVet}
                  disabled={deleting}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(vet.specialties ?? []).map((s) => (
                <Badge key={s.id} variant="secondary">
                  {s.name}
                </Badge>
              ))}
              {!vet.specialties?.length && (
                <span className="text-sm text-muted-foreground">
                  General Practice
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
