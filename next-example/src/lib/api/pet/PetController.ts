import { client } from "@/lib/api/client";
import type {
  PetResponse,
  CreatePetRequest,
  UpdatePetRequest,
} from "@/lib/types/api";

export async function getPets(): Promise<PetResponse[]> {
  const { data, error } = await client.GET<PetResponse[]>("/v1/pets");
  if (error) throw error;
  return data ?? [];
}

export async function getPetById(id: number): Promise<PetResponse> {
  const { data, error } = await client.GET<PetResponse>(`/v1/pets/${id}`);
  if (error) throw error;
  if (!data) throw new Error("Pet not found");
  return data;
}

export async function getPetsByOwnerId(
  ownerId: number
): Promise<PetResponse[]> {
  const { data, error } = await client.GET<PetResponse[]>(
    `/v1/owners/${ownerId}/pets`
  );
  if (error) throw error;
  return data ?? [];
}

export async function createPet(
  request: CreatePetRequest
): Promise<PetResponse> {
  const { data, error } = await client.POST<PetResponse>("/v1/pets", request);
  if (error) throw error;
  if (!data) throw new Error("Failed to create pet");
  return data;
}

export async function createPetForOwner(
  ownerId: number,
  request: Omit<CreatePetRequest, "ownerId">
): Promise<PetResponse> {
  const { data, error } = await client.POST<PetResponse>(
    `/v1/owners/${ownerId}/pets`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to create pet");
  return data;
}

export async function updatePet(
  id: number,
  request: UpdatePetRequest
): Promise<PetResponse> {
  const { data, error } = await client.PUT<PetResponse>(
    `/v1/pets/${id}`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to update pet");
  return data;
}

export async function deletePet(id: number): Promise<void> {
  const { error } = await client.DELETE(`/v1/pets/${id}`);
  if (error) throw error;
}

export async function getPetForOwner(
  ownerId: number,
  petId: number
): Promise<PetResponse> {
  const { data, error } = await client.GET<PetResponse>(
    `/v1/owners/${ownerId}/pets/${petId}`
  );
  if (error) throw error;
  if (!data) throw new Error("Pet not found");
  return data;
}

export async function updatePetForOwner(
  ownerId: number,
  petId: number,
  request: UpdatePetRequest
): Promise<PetResponse> {
  const { data, error } = await client.PUT<PetResponse>(
    `/v1/owners/${ownerId}/pets/${petId}`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to update pet");
  return data;
}

export async function deletePetForOwner(
  ownerId: number,
  petId: number
): Promise<void> {
  const { error } = await client.DELETE(
    `/v1/owners/${ownerId}/pets/${petId}`
  );
  if (error) throw error;
}
