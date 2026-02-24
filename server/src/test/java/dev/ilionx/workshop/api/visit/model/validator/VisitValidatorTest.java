package dev.ilionx.workshop.api.visit.model.validator;

import dev.ilionx.workshop.api.visit.model.request.CreateVisitRequest;
import dev.ilionx.workshop.api.visit.model.request.UpdateVisitRequest;
import dev.ilionx.workshop.support.UnitTest;
import io.github.jframe.exception.core.ValidationException;
import io.github.jframe.validation.ValidationResult;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static dev.ilionx.workshop.api.visit.model.validator.VisitValidator.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Unit Test - Visit Validator.
 */
@DisplayName("Unit Test - Visit Validator")
class VisitValidatorTest extends UnitTest {

    private static final LocalDate VALID_DATE = LocalDate.of(2023, 1, 15);
    private static final String VALID_DESCRIPTION = "Annual checkup";

    private VisitValidator validator;

    @BeforeEach
    void setUp() {
        validator = new VisitValidator();
    }

    // ==================== Create Request Tests ====================

    @Test
    @DisplayName("Should accept valid create request with date and description")
    void shouldAcceptValidCreateRequestWithDateAndDescription() {
        final CreateVisitRequest request = new CreateVisitRequest();
        request.setDate(VALID_DATE);
        request.setDescription(VALID_DESCRIPTION);
        final ValidationResult result = new ValidationResult();

        validator.validate(request, result);

        assertThat(result.hasErrors(), is(false));
    }

    @Test
    @DisplayName("Should accept valid create request with date and null description")
    void shouldAcceptValidCreateRequestWithDateAndNullDescription() {
        final CreateVisitRequest request = new CreateVisitRequest();
        request.setDate(VALID_DATE);
        request.setDescription(null);
        final ValidationResult result = new ValidationResult();

        validator.validate(request, result);

        assertThat(result.hasErrors(), is(false));
    }

    @Test
    @DisplayName("Should accept valid create request with date and empty description")
    void shouldAcceptValidCreateRequestWithDateAndEmptyDescription() {
        final CreateVisitRequest request = new CreateVisitRequest();
        request.setDate(VALID_DATE);
        request.setDescription("");
        final ValidationResult result = new ValidationResult();

        validator.validate(request, result);

        assertThat(result.hasErrors(), is(false));
    }

    @Test
    @DisplayName("Should reject create request when date is null")
    void shouldRejectCreateRequestWhenDateIsNull() {
        final CreateVisitRequest request = new CreateVisitRequest();
        request.setDate(null);
        request.setDescription(VALID_DESCRIPTION);
        final ValidationResult result = new ValidationResult();

        final ValidationException exception =
            assertThrows(ValidationException.class, () -> validator.validate(request, result));

        assertThat(exception.getValidationResult().hasErrors(), is(true));
        assertThat(
            exception.getValidationResult().getErrors().stream()
                .anyMatch(e -> DATE_REQUIRED.equals(e.getCode())),
            is(true)
        );
    }

    @Test
    @DisplayName("Should reject create request when request body is null")
    void shouldRejectCreateRequestWhenRequestBodyIsNull() {
        final ValidationResult result = new ValidationResult();

        final ValidationException exception =
            assertThrows(ValidationException.class, () -> validator.validate((CreateVisitRequest) null, result));

        assertThat(exception.getValidationResult().getErrors().size(), is(1));
        assertThat(
            exception.getValidationResult().getErrors().get(0).getCode(),
            is(equalTo(BODY_IS_MISSING))
        );
    }

    // ==================== Update Request Tests ====================

    @Test
    @DisplayName("Should accept valid update request")
    void shouldAcceptValidUpdateRequest() {
        final UpdateVisitRequest request = new UpdateVisitRequest();
        request.setDate(VALID_DATE);
        request.setDescription(VALID_DESCRIPTION);
        final ValidationResult result = new ValidationResult();

        validator.validate(request, result);

        assertThat(result.hasErrors(), is(false));
    }

    @Test
    @DisplayName("Should reject update request when date is null")
    void shouldRejectUpdateRequestWhenDateIsNull() {
        final UpdateVisitRequest request = new UpdateVisitRequest();
        request.setDate(null);
        request.setDescription(VALID_DESCRIPTION);
        final ValidationResult result = new ValidationResult();

        final ValidationException exception =
            assertThrows(ValidationException.class, () -> validator.validate(request, result));

        assertThat(exception.getValidationResult().hasErrors(), is(true));
        assertThat(
            exception.getValidationResult().getErrors().stream()
                .anyMatch(e -> DATE_REQUIRED.equals(e.getCode())),
            is(true)
        );
    }
}
