package dev.ilionx.workshop.api.pet.repository;

import dev.ilionx.workshop.api.pet.model.Pet;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link Pet} entities.
 */
@Repository
public interface PetRepository extends JpaRepository<Pet, Integer> {

    /**
     * Finds all pets belonging to the specified owner.
     *
     * @param ownerId the owner's ID
     * @return list of pets for the given owner
     */
    List<Pet> findByOwnerId(Integer ownerId);

    /**
     * Finds all pets whose name contains the given string (case-insensitive).
     *
     * @param name the name (or substring) to search for
     * @return list of pets whose name contains the given string
     */
    List<Pet> findByNameContainingIgnoreCase(String name);
}
