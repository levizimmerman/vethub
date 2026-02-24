package dev.ilionx.workshop.api.pet.controller;

import dev.ilionx.workshop.api.owner.model.Owner;
import dev.ilionx.workshop.api.pet.model.Pet;
import dev.ilionx.workshop.api.pet.model.PetType;
import dev.ilionx.workshop.api.pet.model.request.CreatePetRequest;
import dev.ilionx.workshop.api.pet.model.request.UpdatePetRequest;
import dev.ilionx.workshop.api.pet.model.response.PetResponse;
import dev.ilionx.workshop.support.IntegrationTest;
import io.github.jframe.exception.resource.ErrorResponseResource;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static dev.ilionx.workshop.api.Paths.PETS;
import static dev.ilionx.workshop.api.Paths.PET_BY_ID;
import static dev.ilionx.workshop.common.exception.ApiErrorCode.OWNER_NOT_FOUND;
import static dev.ilionx.workshop.common.exception.ApiErrorCode.PET_NOT_FOUND;
import static io.github.jframe.util.mapper.ObjectMappers.fromJson;
import static io.github.jframe.util.mapper.ObjectMappers.toJson;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("Integration Test - Pet Global Controller")
class PetGlobalControllerTest extends IntegrationTest {

    private static final int NON_EXISTENT_PET_ID = 999;
    private static final int NON_EXISTENT_OWNER_ID = 999;

    private static final String PET_NAME = "Leo";
    private static final LocalDate PET_BIRTH_DATE = LocalDate.of(2020, 9, 7);
    private static final String UPDATED_PET_NAME = "Max";

    // ========================= LIST =========================
    @Test
    @DisplayName("GET /api/v1/pets?name=Buddy returns only pets whose name contains Buddy")
    void getNameFilterReturnsOnlyPetsWhoseNameContainsBuddy() throws Exception {
        // Given: An owner with pets "Buddy", "Buddy Jr", and "Max" exists
        final Owner owner = aSavedOwner();
        savePetWithName(owner, "Buddy");
        savePetWithName(owner, "Buddy Jr");
        savePetWithName(owner, "Max");

        // When: GET /api/v1/pets?name=Buddy
        // Then: Returns 200 with list containing only "Buddy" and "Buddy Jr"
        mockMvc.perform(get(PETS).param("name", "Buddy"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[*].name", containsInAnyOrder("Buddy", "Buddy Jr")));
    }

    @Test
    @DisplayName("GET /api/v1/pets?name=buddy is case-insensitive and matches Buddy")
    void getNameFilterIsCaseInsensitive() throws Exception {
        // Given: A pet named "Buddy" exists
        final Owner owner = aSavedOwner();
        savePetWithName(owner, "Buddy");

        // When: GET /api/v1/pets?name=buddy (lowercase)
        // Then: Returns 200 with list containing the pet "Buddy"
        mockMvc.perform(get(PETS).param("name", "buddy"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].name", is(equalTo("Buddy"))));
    }

    @Test
    @DisplayName("GET /api/v1/pets with empty name parameter returns all pets")
    void getEmptyNameParameterReturnsAllPets() throws Exception {
        // Given: Multiple pets exist
        final Owner owner = aSavedOwner();
        savePetWithName(owner, "Buddy");
        savePetWithName(owner, "Max");

        // When: GET /api/v1/pets?name= or GET /api/v1/pets (no name param)
        // Then: Returns 200 with all pets
        mockMvc.perform(get(PETS).param("name", ""))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get(PETS))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @DisplayName("GET /api/v1/pets?name=NoMatch returns 200 with empty list, not 404")
    void getNoMatchesReturns200WithEmptyList() throws Exception {
        // Given: A pet named "Buddy" exists (no pet named "NoMatch")
        final Owner owner = aSavedOwner();
        savePetWithName(owner, "Buddy");

        // When: GET /api/v1/pets?name=NoMatch
        // Then: Returns 200 with empty array
        mockMvc.perform(get(PETS).param("name", "NoMatch"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)))
            .andExpect(jsonPath("$", is(empty())));
    }

    @Test
    @DisplayName("Should return all pets when pets exist")
    void shouldReturnAllPetsWhenPetsExist() throws Exception {
        // Given: An owner with a pet exists in the database
        final Owner owner = aSavedOwner();
        final Pet pet = aSavedPet(owner);

        // When: Requesting all pets
        // Then: Should return 200 with list containing the pet
        mockMvc.perform(get(PETS))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id", is(equalTo(pet.getId()))))
            .andExpect(jsonPath("$[0].name", is(equalTo(PET_NAME))))
            .andExpect(jsonPath("$[0].ownerId", is(equalTo(owner.getId()))));
    }

    @Test
    @DisplayName("Should return empty list when no pets exist")
    void shouldReturnEmptyListWhenNoPetsExist() throws Exception {
        // Given: No pets exist in the database

        // When: Requesting all pets
        // Then: Should return 200 with empty array
        mockMvc.perform(get(PETS))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)));
    }

    // ========================= GET BY ID =========================
    @Test
    @DisplayName("Should return pet when valid pet ID exists")
    void shouldReturnPetWhenValidPetIdExists() throws Exception {
        // Given: An owner with a pet exists in the database
        final Owner owner = aSavedOwner();
        final Pet pet = aSavedPet(owner);

        // When: Requesting pet by ID
        // Then: Should return 200 with pet details
        mockMvc.perform(get(PET_BY_ID, pet.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(equalTo(pet.getId()))))
            .andExpect(jsonPath("$.name", is(equalTo(PET_NAME))))
            .andExpect(jsonPath("$.birthDate", is(notNullValue())))
            .andExpect(jsonPath("$.type.id", is(equalTo(1))))
            .andExpect(jsonPath("$.type.name", is(notNullValue())))
            .andExpect(jsonPath("$.ownerId", is(equalTo(owner.getId()))))
            .andExpect(jsonPath("$.visits", is(notNullValue())));
    }

    @Test
    @DisplayName("Should return not found when pet ID does not exist")
    void shouldReturnNotFoundWhenPetIdDoesNotExist() throws Exception {
        // Given: No pet exists with ID 999

        // When: Requesting non-existent pet
        final ResultActions response = mockMvc.perform(get(PET_BY_ID, NON_EXISTENT_PET_ID));

        // Then: Should return 404 with error message
        response.andExpect(status().isNotFound());

        final String content = response.andReturn().getResponse().getContentAsString();
        final ErrorResponseResource error = fromJson(content, ErrorResponseResource.class);
        assertThat(error.getErrorMessage(), is(equalTo(PET_NOT_FOUND.getReason())));
    }

    // ========================= CREATE =========================
    @Test
    @DisplayName("Should create pet when valid data provided")
    void shouldCreatePetWhenValidDataProvided() throws Exception {
        // Given: An owner exists and a valid create pet request with ownerId in body
        final Owner owner = aSavedOwner();
        final CreatePetRequest request = aCreatePetRequestWithOwner(owner.getId());

        // When: Creating the pet
        final String responseBody = mockMvc.perform(
            post(PETS)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request))
        )
            // Then: Should return 201 with pet response
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id", is(notNullValue())))
            .andExpect(jsonPath("$.name", is(equalTo(PET_NAME))))
            .andExpect(jsonPath("$.ownerId", is(equalTo(owner.getId()))))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // And: The returned pet should be valid
        final PetResponse petResponse = fromJson(responseBody, PetResponse.class);
        assertThat(petResponse.getId(), is(notNullValue()));
        assertThat(petResponse.getName(), is(equalTo(PET_NAME)));
        assertThat(petResponse.getOwnerId(), is(equalTo(owner.getId())));
    }

    @Test
    @DisplayName("Should return not found when owner does not exist for create pet")
    void shouldReturnNotFoundWhenOwnerDoesNotExistForCreatePet() throws Exception {
        // Given: A create pet request with non-existent owner ID
        final CreatePetRequest request = aCreatePetRequestWithOwner(NON_EXISTENT_OWNER_ID);

        // When: Creating pet for non-existent owner
        final ResultActions response = mockMvc.perform(
            post(PETS)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request))
        );

        // Then: Should return 404 with error message
        response.andExpect(status().isNotFound());

        final String content = response.andReturn().getResponse().getContentAsString();
        final ErrorResponseResource error = fromJson(content, ErrorResponseResource.class);
        assertThat(error.getErrorMessage(), is(equalTo(OWNER_NOT_FOUND.getReason())));
    }

    // ========================= UPDATE =========================
    @Test
    @DisplayName("Should update pet when valid data provided")
    void shouldUpdatePetWhenValidDataProvided() throws Exception {
        // Given: An existing pet in the database
        final Owner owner = aSavedOwner();
        final Pet pet = aSavedPet(owner);
        final UpdatePetRequest request = anUpdatePetRequest();

        // When: Updating the pet
        // Then: Should return 200 OK with updated pet
        mockMvc.perform(
            put(PET_BY_ID, pet.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request))
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(equalTo(pet.getId()))))
            .andExpect(jsonPath("$.name", is(equalTo(UPDATED_PET_NAME))));
    }

    @Test
    @DisplayName("Should return not found when pet does not exist for update")
    void shouldReturnNotFoundWhenPetDoesNotExistForUpdate() throws Exception {
        // Given: An update request for non-existent pet
        final UpdatePetRequest request = anUpdatePetRequest();

        // When: Updating non-existent pet
        final ResultActions response = mockMvc.perform(
            put(PET_BY_ID, NON_EXISTENT_PET_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request))
        );

        // Then: Should return 404 with error message
        response.andExpect(status().isNotFound());

        final String content = response.andReturn().getResponse().getContentAsString();
        final ErrorResponseResource error = fromJson(content, ErrorResponseResource.class);
        assertThat(error.getErrorMessage(), is(equalTo(PET_NOT_FOUND.getReason())));
    }

    // ========================= DELETE =========================
    @Test
    @DisplayName("Should delete pet when pet exists")
    void shouldDeletePetWhenPetExists() throws Exception {
        // Given: An existing pet in the database
        final Owner owner = aSavedOwner();
        final Pet pet = aSavedPet(owner);

        // When: Deleting the pet
        // Then: Should return 204 no content
        mockMvc.perform(delete(PET_BY_ID, pet.getId()))
            .andExpect(status().isNoContent());

        // And: The pet should no longer exist
        mockMvc.perform(get(PET_BY_ID, pet.getId()))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return not found when pet does not exist for delete")
    void shouldReturnNotFoundWhenPetDoesNotExistForDelete() throws Exception {
        // Given: No pet exists with ID 999

        // When: Deleting non-existent pet
        final ResultActions response = mockMvc.perform(delete(PET_BY_ID, NON_EXISTENT_PET_ID));

        // Then: Should return 404 with error message
        response.andExpect(status().isNotFound());

        final String content = response.andReturn().getResponse().getContentAsString();
        final ErrorResponseResource error = fromJson(content, ErrorResponseResource.class);
        assertThat(error.getErrorMessage(), is(equalTo(PET_NOT_FOUND.getReason())));
    }

    private Pet savePetWithName(final Owner owner, final String name) {
        final PetType petType = petTypeRepository.findById(1)
            .orElseThrow(() -> new RuntimeException("Pet type with ID 1 not found in seed data"));
        final Pet pet = new Pet();
        pet.setName(name);
        pet.setBirthDate(PET_BIRTH_DATE);
        pet.setType(petType);
        pet.setOwner(owner);
        return petRepository.save(pet);
    }
}
