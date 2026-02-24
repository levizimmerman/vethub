"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPetForOwner,
  deletePetForOwner,
} from "@/lib/api/pet/PetController";
import { getVisitsByPet } from "@/lib/api/visit/VisitController";
import type { PetResponse, VisitResponse } from "@/lib/types/api";
import { Button } from "@/lib/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/lib/components/ui/card";
import {
  ArrowLeft,
  PawPrint,
  Calendar,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "Unknown";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = Number(params.id);
  const petId = Number(params.petId);
  const [pet, setPet] = useState<PetResponse | null>(null);
  const [visits, setVisits] = useState<VisitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [petData, visitsData] = await Promise.all([
        getPetForOwner(ownerId, petId),
        getVisitsByPet(ownerId, petId),
      ]);
      setPet(petData);
      setVisits(visitsData);
    } catch (err) {
      toast.error("Failed to load pet");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePet() {
    if (!confirm("Are you sure you want to delete this pet?")) return;
    setDeleting(true);
    try {
      await deletePetForOwner(ownerId, petId);
      toast.success("Pet deleted successfully");
      router.push(`/owners/${ownerId}`);
    } catch (err) {
      toast.error("Failed to delete pet");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (ownerId && petId) loadData();
  }, [ownerId, petId]);

  return (
    <div className="container mx-auto px-4 py-8">
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
          <p className="text-muted-foreground">Loading pet...</p>
        </div>
      ) : !pet ? (
        <div className="card p-12 text-center">
          <PawPrint className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Pet not found</p>
        </div>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <PawPrint className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{pet.name}</CardTitle>
                    <CardDescription>
                      {pet.type?.name ?? "Pet"} • Born{" "}
                      {formatDate(pet.birthDate)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    href={`/owners/${ownerId}/pets/${petId}/edit`}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeletePet}
                    disabled={deleting}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Visits</h2>
            <Button
              href={`/owners/${ownerId}/pets/${petId}/visits/new`}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Visit
            </Button>
          </div>

          {visits.length === 0 ? (
            <div className="card p-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No visits recorded</p>
              <Button
                href={`/owners/${ownerId}/pets/${petId}/visits/new`}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add First Visit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((visit) => (
                <Card key={visit.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {new Date(visit.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {visit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
