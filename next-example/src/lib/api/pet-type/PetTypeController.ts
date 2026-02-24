import { client } from "@/lib/api/client";
import type {
  PetTypeResponse,
  CreatePetTypeRequest,
  UpdatePetTypeRequest,
} from "@/lib/types/api";

export async function getPetTypes(): Promise<PetTypeResponse[]> {
  const { data, error } = await client.GET<PetTypeResponse[]>("/v1/pet-types");
  if (error) throw error;
  return data ?? [];
}

export async function getPetTypeById(id: number): Promise<PetTypeResponse> {
  const { data, error } = await client.GET<PetTypeResponse>(
    `/v1/pet-types/${id}`
  );
  if (error) throw error;
  if (!data) throw new Error("Pet type not found");
  return data;
}

export async function createPetType(
  request: CreatePetTypeRequest
): Promise<PetTypeResponse> {
  const { data, error } = await client.POST<PetTypeResponse>(
    "/v1/pet-types",
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to create pet type");
  return data;
}

export async function updatePetType(
  id: number,
  request: UpdatePetTypeRequest
): Promise<PetTypeResponse> {
  const { data, error } = await client.PUT<PetTypeResponse>(
    `/v1/pet-types/${id}`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to update pet type");
  return data;
}

export async function deletePetType(id: number): Promise<void> {
  const { error } = await client.DELETE(`/v1/pet-types/${id}`);
  if (error) throw error;
}
