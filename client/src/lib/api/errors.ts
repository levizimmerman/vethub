/**
 * Extract a user-friendly message from an API error (e.g. validation or API error response).
 */
export function getApiErrorMessage(err: unknown): string | undefined {
	if (err == null) return undefined;
	const o = err as Record<string, unknown>;
	// ValidationErrorResponseResource / ApiErrorResponseResource
	if (typeof o.errorMessage === 'string' && o.errorMessage) return o.errorMessage;
	const errors = o.errors as Array<{ code?: string; field?: string }> | undefined;
	if (Array.isArray(errors) && errors.length > 0 && typeof errors[0].code === 'string')
		return errors[0].code;
	return undefined;
}
