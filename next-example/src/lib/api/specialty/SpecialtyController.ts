import { client } from "@/lib/api/client";
import type {
  SpecialtyResponse,
  CreateSpecialtyRequest,
  UpdateSpecialtyRequest,
} from "@/lib/types/api";

export async function getSpecialties(): Promise<SpecialtyResponse[]> {
  const { data, error } = await client.GET<SpecialtyResponse[]>(
    "/v1/specialties"
  );
  if (error) throw error;
  return data ?? [];
}

export async function getSpecialtyById(id: number): Promise<SpecialtyResponse> {
  const { data, error } = await client.GET<SpecialtyResponse>(
    `/v1/specialties/${id}`
  );
  if (error) throw error;
  if (!data) throw new Error("Specialty not found");
  return data;
}

export async function createSpecialty(
  request: CreateSpecialtyRequest
): Promise<SpecialtyResponse> {
  const { data, error } = await client.POST<SpecialtyResponse>(
    "/v1/specialties",
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to create specialty");
  return data;
}

export async function updateSpecialty(
  id: number,
  request: UpdateSpecialtyRequest
): Promise<SpecialtyResponse> {
  const { data, error } = await client.PUT<SpecialtyResponse>(
    `/v1/specialties/${id}`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to update specialty");
  return data;
}

export async function deleteSpecialty(id: number): Promise<void> {
  const { error } = await client.DELETE(`/v1/specialties/${id}`);
  if (error) throw error;
}
