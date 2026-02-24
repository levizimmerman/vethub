"use client";

import { useState, useEffect } from "react";
import { User, Save, Loader2 } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/lib/components/ui/card";

export interface OwnerFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
}

interface OwnerFormProps {
  initialData?: Partial<OwnerFormData>;
  onSubmit: (data: OwnerFormData) => Promise<void>;
  submitLabel?: string;
  isEdit?: boolean;
}

export function OwnerForm({
  initialData = {},
  onSubmit,
  submitLabel = "Save",
  isEdit = false,
}: OwnerFormProps) {
  const [formData, setFormData] = useState<OwnerFormData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    telephone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OwnerFormData, string>>>({});

  useEffect(() => {
    setFormData({
      firstName: initialData.firstName ?? "",
      lastName: initialData.lastName ?? "",
      address: initialData.address ?? "",
      city: initialData.city ?? "",
      telephone: initialData.telephone ?? "",
    });
  }, [initialData.firstName, initialData.lastName, initialData.address, initialData.city, initialData.telephone]);

  function validate(): boolean {
    const next: Partial<Record<keyof OwnerFormData, string>> = {};
    if (!formData.firstName.trim()) next.firstName = "First name is required";
    if (!formData.lastName.trim()) next.lastName = "Last name is required";
    if (formData.telephone && !/^[\d\s\-()]+$/.test(formData.telephone)) {
      next.telephone = "Invalid phone number format";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{isEdit ? "Edit Owner" : "New Owner"}</CardTitle>
            <CardDescription>
              {isEdit ? "Update owner information" : "Register a new pet owner"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="George"
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Franklin"
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="110 W. Liberty St."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Madison"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, telephone: e.target.value }))
                }
                placeholder="6085551023"
                className={errors.telephone ? "border-destructive" : ""}
              />
              {errors.telephone && (
                <p className="text-sm text-destructive">{errors.telephone}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" href="/owners">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
