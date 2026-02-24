<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createVisitForPet } from '$lib/api/visit/VisitController';
	import { getApiErrorMessage } from '$lib/api/errors';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowLeft, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	const ownerId = $derived(Number($page.params.id));
	const petId = $derived(Number($page.params.petId));

	let visitDate = $state(new Date().toISOString().split('T')[0]);
	let description = $state('');
	let submitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitting = true;

		try {
			await createVisitForPet(ownerId, petId, {
				date: visitDate,
				description: description.trim() || undefined
			});
			toast.success('Visit recorded successfully');
			goto(`/owners/${ownerId}/pets/${petId}`);
		} catch (err: unknown) {
			const message = getApiErrorMessage(err);
			toast.error(message ?? 'Failed to create visit');
			console.error('Error:', err);
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Add Visit | VetHub</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-8">
	<!-- Back button -->
	<Button variant="ghost" href="/owners/{ownerId}/pets/{petId}" class="mb-6 gap-2">
		<ArrowLeft class="h-4 w-4" />
		Back to Pet
	</Button>

	<div class="mb-6">
		<h1 class="text-2xl font-bold">Record New Visit</h1>
		<p class="text-muted-foreground">Add a new visit record for this pet</p>
	</div>

	<div class="card p-6">
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="space-y-2">
				<Label for="visitDate">Visit Date</Label>
				<Input
					id="visitDate"
					type="date"
					bind:value={visitDate}
					required
					disabled={submitting}
				/>
			</div>

			<div class="space-y-2">
				<Label for="description">Description (optional)</Label>
				<Textarea
					id="description"
					bind:value={description}
					placeholder="Describe the reason for the visit (e.g., Annual checkup, Vaccination, etc.)"
					rows={4}
					disabled={submitting}
				/>
			</div>

			<div class="flex justify-end gap-3">
				<Button
					type="button"
					variant="outline"
					href="/owners/{ownerId}/pets/{petId}"
					disabled={submitting}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={submitting}>
					{#if submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Record Visit
				</Button>
			</div>
		</form>
	</div>
</div>
