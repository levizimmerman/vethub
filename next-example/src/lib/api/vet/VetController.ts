import { client } from "@/lib/api/client";
import type {
  VetResponse,
  CreateVetRequest,
  UpdateVetRequest,
} from "@/lib/types/api";

export async function getVets(): Promise<VetResponse[]> {
  const { data, error } = await client.GET<VetResponse[]>("/v1/vets");
  if (error) throw error;
  return data ?? [];
}

export async function getVetById(id: number): Promise<VetResponse> {
  const { data, error } = await client.GET<VetResponse>(`/v1/vets/${id}`);
  if (error) throw error;
  if (!data) throw new Error("Vet not found");
  return data;
}

export async function createVet(
  request: CreateVetRequest
): Promise<VetResponse> {
  const { data, error } = await client.POST<VetResponse>("/v1/vets", request);
  if (error) throw error;
  if (!data) throw new Error("Failed to create vet");
  return data;
}

export async function updateVet(
  id: number,
  request: UpdateVetRequest
): Promise<VetResponse> {
  const { data, error } = await client.PUT<VetResponse>(
    `/v1/vets/${id}`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to update vet");
  return data;
}

export async function deleteVet(id: number): Promise<void> {
  const { error } = await client.DELETE(`/v1/vets/${id}`);
  if (error) throw error;
}
