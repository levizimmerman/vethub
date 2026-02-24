import { client } from "@/lib/api/client";
import type {
  OwnerResponse,
  CreateOwnerRequest,
  UpdateOwnerRequest,
} from "@/lib/types/api";

export async function getOwners(): Promise<OwnerResponse[]> {
  const { data, error } = await client.GET<OwnerResponse[]>("/v1/owners");
  if (error) throw error;
  return data ?? [];
}

export async function getOwnerById(id: number): Promise<OwnerResponse> {
  const { data, error } = await client.GET<OwnerResponse>(`/v1/owners/${id}`);
  if (error) throw error;
  if (!data) throw new Error("Owner not found");
  return data;
}

export async function createOwner(
  request: CreateOwnerRequest
): Promise<OwnerResponse> {
  const { data, error } = await client.POST<OwnerResponse>("/v1/owners", request);
  if (error) throw error;
  if (!data) throw new Error("Failed to create owner");
  return data;
}

export async function updateOwner(
  id: number,
  request: UpdateOwnerRequest
): Promise<OwnerResponse> {
  const { data, error } = await client.PUT<OwnerResponse>(
    `/v1/owners/${id}`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to update owner");
  return data;
}

export async function deleteOwner(id: number): Promise<void> {
  const { error } = await client.DELETE(`/v1/owners/${id}`);
  if (error) throw error;
}
