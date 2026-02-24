import { client } from "@/lib/api/client";
import type {
  VisitResponse,
  CreateVisitRequest,
  UpdateVisitRequest,
} from "@/lib/types/api";

export async function getVisits(): Promise<VisitResponse[]> {
  const { data, error } = await client.GET<VisitResponse[]>("/v1/visits");
  if (error) throw error;
  return data ?? [];
}

export async function getVisitById(id: number): Promise<VisitResponse> {
  const { data, error } = await client.GET<VisitResponse>(`/v1/visits/${id}`);
  if (error) throw error;
  if (!data) throw new Error("Visit not found");
  return data;
}

export async function getVisitsByPet(
  ownerId: number,
  petId: number
): Promise<VisitResponse[]> {
  const { data, error } = await client.GET<VisitResponse[]>(
    `/v1/owners/${ownerId}/pets/${petId}/visits`
  );
  if (error) throw error;
  return data ?? [];
}

export async function createVisit(
  request: CreateVisitRequest
): Promise<VisitResponse> {
  const { data, error } = await client.POST<VisitResponse>(
    "/v1/visits",
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to create visit");
  return data;
}

export async function createVisitForPet(
  ownerId: number,
  petId: number,
  request: Omit<CreateVisitRequest, "petId">
): Promise<VisitResponse> {
  const { data, error } = await client.POST<VisitResponse>(
    `/v1/owners/${ownerId}/pets/${petId}/visits`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to create visit");
  return data;
}

export async function updateVisit(
  id: number,
  request: UpdateVisitRequest
): Promise<VisitResponse> {
  const { data, error } = await client.PUT<VisitResponse>(
    `/v1/visits/${id}`,
    request
  );
  if (error) throw error;
  if (!data) throw new Error("Failed to update visit");
  return data;
}

export async function deleteVisit(id: number): Promise<void> {
  const { error } = await client.DELETE(`/v1/visits/${id}`);
  if (error) throw error;
}
