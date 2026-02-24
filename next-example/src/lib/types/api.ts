/**
 * API types matching the VetHub Spring Boot backend OpenAPI schema.
 */

export interface OwnerResponse {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
  pets?: PetSummaryResponse[];
}

export interface CreateOwnerRequest {
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  telephone?: string;
}

export interface UpdateOwnerRequest {
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  telephone?: string;
}

export interface PetSummaryResponse {
  id: number;
  name: string;
  birthDate: string;
  typeName: string;
}

export interface PetResponse {
  id: number;
  name: string;
  birthDate: string;
  type?: PetTypeResponse;
  ownerId: number;
  visits?: VisitSummaryResponse[];
}

export interface PetTypeResponse {
  id: number;
  name: string;
}

export interface CreatePetTypeRequest {
  name: string;
}

export interface UpdatePetTypeRequest {
  name: string;
}

export interface CreatePetRequest {
  name: string;
  birthDate: string;
  typeId: number;
  ownerId?: number;
}

export interface UpdatePetRequest {
  name: string;
  birthDate: string;
  typeId: number;
}

export interface VisitSummaryResponse {
  id: number;
  date: string;
  description: string;
}

export interface VisitResponse {
  id: number;
  date: string;
  description: string;
  petId: number;
}

export interface CreateVisitRequest {
  date: string;
  description: string;
  petId?: number;
}

export interface UpdateVisitRequest {
  date: string;
  description: string;
}

export interface VetResponse {
  id: number;
  firstName: string;
  lastName: string;
  specialties?: SpecialtyResponse[];
}

export interface CreateVetRequest {
  firstName: string;
  lastName: string;
  specialtyIds?: number[];
}

export interface UpdateVetRequest {
  firstName: string;
  lastName: string;
  specialtyIds?: number[];
}

export interface SpecialtyResponse {
  id: number;
  name: string;
}

export interface CreateSpecialtyRequest {
  name: string;
}

export interface UpdateSpecialtyRequest {
  name: string;
}
