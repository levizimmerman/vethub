<script lang="ts">
	import { getPets } from '$lib/api/pet/PetController';
	import type { PetResponse } from '$lib/api/models';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import { PawPrint, Search, User } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let pets = $state<PetResponse[]>([]);
	let loading = $state(true);
	let searchQuery = $state('');

	// Filtered pets based on search query
	let filteredPets = $derived(() => {
		if (!searchQuery.trim()) return pets;
		const query = searchQuery.toLowerCase();
		return pets.filter(
			(pet) =>
				pet.name?.toLowerCase().includes(query) ||
				pet.type?.name?.toLowerCase().includes(query)
		);
	});

	async function loadPets() {
		loading = true;
		try {
			pets = await getPets();
		} catch (err) {
			toast.error('Failed to load pets');
			console.error('Error loading pets:', err);
		} finally {
			loading = false;
		}
	}

	// Load pets on mount
	$effect(() => {
		loadPets();
	});
</script>

<svelte:head>
	<title>Pets | VetHub</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-3">
			<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
				<PawPrint class="h-6 w-6 text-primary" />
			</div>
			<div>
				<h1 class="text-2xl font-bold text-foreground">Pets</h1>
				<p class="text-sm text-muted-foreground">View and manage pets, their types, and medical history</p>
			</div>
		</div>
	</div>

	<!-- Search -->
	<div class="mb-6">
		<div class="relative max-w-md">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search by name or type..."
				bind:value={searchQuery}
				class="pl-10"
			/>
		</div>
	</div>

	<!-- Table -->
	{#if loading}
		<div class="card p-12 text-center">
			<div class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			<p class="text-muted-foreground">Loading pets...</p>
		</div>
	{:else if filteredPets().length === 0}
		<div class="card p-12 text-center">
			<PawPrint class="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
			{#if searchQuery}
				<p class="text-muted-foreground">No pets found matching "{searchQuery}"</p>
			{:else}
				<p class="text-muted-foreground">No pets registered yet</p>
				<p class="mt-2 text-sm text-muted-foreground">Add an owner first, then add pets from their profile.</p>
			{/if}
		</div>
	{:else}
		<div class="card overflow-hidden">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Birth date</Table.Head>
						<Table.Head>Owner</Table.Head>
						<Table.Head class="w-[100px]">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredPets() as pet (pet.id)}
						<Table.Row class="hover:bg-muted/50">
							<Table.Cell>
								<a
									href="/owners/{pet.ownerId}/pets/{pet.id}"
									class="font-medium text-foreground hover:text-primary"
								>
									{pet.name}
								</a>
							</Table.Cell>
							<Table.Cell>
								<span class="text-sm text-muted-foreground">{pet.type?.name ?? '—'}</span>
							</Table.Cell>
							<Table.Cell>
								<span class="text-sm text-muted-foreground">{pet.birthDate ?? '—'}</span>
							</Table.Cell>
							<Table.Cell>
								<a
									href="/owners/{pet.ownerId}"
									class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
								>
									<User class="h-3.5 w-3.5" />
									Owner #{pet.ownerId}
								</a>
							</Table.Cell>
							<Table.Cell>
								<Button variant="ghost" size="sm" href="/owners/{pet.ownerId}/pets/{pet.id}">
									View
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
		<p class="mt-4 text-sm text-muted-foreground">
			Showing {filteredPets().length} of {pets.length} pets
		</p>
	{/if}
</div>
