"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getOwnerById,
  deleteOwner as deleteOwnerApi,
} from "@/lib/api/owner/OwnerController";
import type { OwnerResponse } from "@/lib/types/api";
import { Button } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/lib/components/ui/card";
import {
  User,
  Phone,
  MapPin,
  PawPrint,
  Calendar,
  ArrowLeft,
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

function calculateAge(birthDate: string | undefined): string {
  if (!birthDate) return "Unknown age";
  const birth = new Date(birthDate);
  const now = new Date();
  const years = Math.floor(
    (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  return years === 1 ? "1 year old" : `${years} years old`;
}

export default function OwnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = Number(params.id);
  const [owner, setOwner] = useState<OwnerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  async function loadOwner() {
    setLoading(true);
    try {
      const data = await getOwnerById(ownerId);
      setOwner(data);
    } catch (err) {
      toast.error("Failed to load owner");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOwner() {
    if (
      !confirm(
        "Are you sure you want to delete this owner? This will also delete all their pets."
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteOwnerApi(ownerId);
      toast.success("Owner deleted successfully");
      router.push("/owners");
    } catch (err) {
      toast.error("Failed to delete owner");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (ownerId) loadOwner();
  }, [ownerId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" href="/owners" className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Owners
      </Button>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading owner details...</p>
        </div>
      ) : !owner ? (
        <div className="card p-12 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Owner not found</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {owner.firstName} {owner.lastName}
                      </CardTitle>
                      <CardDescription>Pet Owner</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/owners/${ownerId}/edit`}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteOwner}
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5" />
                    <span>{owner.telephone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {owner.address}, {owner.city}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Pets</h2>
            <Button href={`/owners/${ownerId}/pets/new`} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Pet
            </Button>
          </div>

          {!owner.pets?.length ? (
            <div className="card p-8 text-center">
              <PawPrint className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No pets registered for this owner
              </p>
              <Button
                href={`/owners/${ownerId}/pets/new`}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add First Pet
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {owner.pets.map((pet) => (
                <Card key={pet.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <PawPrint className="h-5 w-5 text-accent" />
                        {pet.name}
                      </CardTitle>
                      <Badge variant="secondary">{pet.typeName}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Born: {formatDate(pet.birthDate)}</span>
                      </div>
                      <p className="text-foreground">
                        {calculateAge(pet.birthDate)}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      href={`/owners/${ownerId}/pets/${pet.id}`}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
