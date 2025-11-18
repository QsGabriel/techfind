<script>
	import {
		Check,
		ChevronDown,
		ChevronLeft,
		ChevronUp,
		NotepadText,
		UserPen,
		X
	} from '@lucide/svelte';
	import { Button, Combobox, Dialog } from 'bits-ui';
	import Loading from '../../components/Loading.svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let loading = $state(false);
	let searchValue = $state('');

	const filteredContracts = $derived(
		searchValue === ''
			? data?.contracts
			: data?.contracts.filter((contract) =>
					contract.objetivo.toLowerCase().includes(searchValue.toLowerCase())
				)
	);
	$inspect(data);

	let provider = {
		name: data?.usuario?.name || 'Nome desconhecido',
		title: data?.usuario?.caract || 'Título desconhecido',
		description: data?.usuario?.desc || 'Descrição não fornecida',
		expertise: data?.usuario?.tags?.split('-') || [],
		completedProjects: 156,
		activeContracts: 12,
		satisfactionRate: 98,
		avatar:
			'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=150',
		coverPhoto:
			'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260',
		verifiedBusiness: true,
		rating: 4.9
	};
</script>

<svelte:head>
	<title>{provider.name} - Perfil de Usuário</title>
	<meta name="description" content="área do usuário, com todas as suas informações" />
</svelte:head>

<Button.Root
	href="../pv/pesquisa"
	class="bg-principal-1 hover:bg-principal-4 mt-4 ml-4 inline-block rounded-full border-2 border-black shadow hover:border-black/80"
>
	<ChevronLeft class="size-10 stroke-1 hover:stroke-black/80" />
</Button.Root>
<div class="profile">
	<div class="cover-photo" style="background-image: url({provider.coverPhoto})">
		<div class="avatar">
			<img src={provider.avatar} alt={provider.name} />
			{#if provider.verifiedBusiness}
				<span class="verified-badge">✓</span>
			{/if}
		</div>
	</div>

	<div class="profile-info">
		<div class="header">
			<div class="provider-info">
				<div class="name-container">
					<h1>{provider.name}</h1>
					<div class="rating">
						<span class="stars">{'★'.repeat(Math.floor(provider.rating))}</span>
						<span class="rating-number">({provider.rating})</span>
					</div>
				</div>
				<p class="title">{provider.title}</p>
			</div>
			<Dialog.Root>
				<Dialog.Trigger
					class="bg-principal-5 hover:bg-principal-3 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-4 font-semibold whitespace-nowrap text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
				>
					<UserPen /> Requerir o Serviço
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
					<Dialog.Content
						class="bg-principal-1 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col gap-8 rounded-lg border p-5 shadow-sm outline-hidden sm:max-w-[490px] md:w-full"
					>
						<Dialog.Title class="flex w-full items-center justify-center tracking-tight">
							<div class="flex flex-col items-center justify-between">
								<h2 class="text-xl font-semibold">Requerimento do Serviço</h2>
							</div>
						</Dialog.Title>
						<div class="text-center text-lg font-semibold italic">
							gostaria de requerer o serviço para o usuário "{provider.name}"
						</div>
						<Dialog.Close
							class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
						>
							<X class="hover:text-principal-4 size-6 text-black" />
						</Dialog.Close>
						<form
							method="POST"
							action="?/notification"
							class="flex w-full flex-col gap-10"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
								};
							}}
						>
							<Combobox.Root
								type="single"
								name="contract"
								onOpenChange={(o) => {
									if (!o) searchValue = '';
								}}
							>
								<div class="relative self-center">
									<NotepadText
										class="absolute start-3 top-1/2 size-6 -translate-y-1/2 text-black"
									/>
									<Combobox.Input
										oninput={(e) => (searchValue = e.currentTarget.value)}
										class="inline-flex h-12 w-[296px] touch-none truncate rounded-sm border bg-white px-11 text-base transition-colors placeholder:text-black/50 focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
										placeholder="Escolha um Contrato"
										aria-label="Escolha um Contrato"
									/>
									<Combobox.Trigger
										class="absolute top-1/2 right-1 size-6 -translate-y-1/2 touch-none"
									>
										<ChevronDown class="size-6 text-black" />
									</Combobox.Trigger>
								</div>
								<Combobox.Portal>
									<Combobox.Content
										class="z-50 h-96 max-h-[var(--bits-combobox-content-available-height)] w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] rounded-xl border bg-white px-1 py-3 outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
										sideOffset={10}
									>
										<Combobox.ScrollUpButton class="flex w-full items-center justify-center py-1">
											<ChevronUp class="size-3" />
										</Combobox.ScrollUpButton>
										<Combobox.Viewport class="p-1">
											{#each filteredContracts as contract, i (i + contract.objetivo)}
												<Combobox.Item
													class="flex h-10 w-full items-center rounded-md py-3 pr-1.5 pl-5 text-sm capitalize outline-hidden transition-colors duration-150 select-none hover:bg-zinc-400"
													value={contract.id}
													label={contract.objetivo}
												>
													{#snippet children({ selected })}
														{contract.objetivo}
														{#if selected}
															<div class="ml-auto">
																<Check />
															</div>
														{/if}
													{/snippet}
												</Combobox.Item>
											{:else}
												<span class="block px-5 py-2 text-sm text-principal-4">
													Nenhum resultado Encontrado. Por Favor Tente Novamente!
												</span>
											{/each}
										</Combobox.Viewport>
										<Combobox.ScrollDownButton class="flex w-full items-center justify-center py-1">
											<ChevronDown class="size-3" />
										</Combobox.ScrollDownButton>
									</Combobox.Content>
								</Combobox.Portal>
							</Combobox.Root>
							<input type="hidden" name="id_contratado" value={data?.usuario?.id} />
							<button
								type="submit"
								disabled={loading}
								class="bg-principal-4 hover:bg-principal-3 flex flex-1 justify-center gap-4 rounded-md px-8 py-4 font-semibold shadow transition-colors duration-300"
							>
								{#if !loading}
									Sim
								{:else}
									<Loading />
								{/if}
							</button>
							<Dialog.Close
								class="-mt-5 flex flex-1 justify-center gap-4 rounded-md bg-red-600 px-8 py-4 font-semibold shadow transition-colors duration-300 hover:bg-red-400"
							>
								Cancelar
							</Dialog.Close>
						</form>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>

		<p class="description">{provider.description}</p>

		<div class="expertise">
			<h2 class="font-bold">Áreas de Expertize</h2>
			<div class="tags">
				{#each provider.expertise as skill}
					<span class="tag">{skill}</span>
				{/each}
			</div>
		</div>

		<div class="stats">
			<div class="stat">
				<span class="number">{provider.completedProjects}</span>
				<span class="label">Completed Projects</span>
			</div>
			<div class="stat">
				<span class="number">{provider.activeContracts}</span>
				<span class="label">Active Contracts</span>
			</div>
			<div class="stat">
				<span class="number">{provider.satisfactionRate}%</span>
				<span class="label">Satisfaction Rate</span>
			</div>
		</div>
	</div>
</div>

<style>
	.profile {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin: 20px auto;
		max-width: 900px;
		overflow: hidden;
	}

	.cover-photo {
		height: 200px;
		background-size: cover;
		background-position: center;
		position: relative;
	}

	.avatar {
		position: absolute;
		bottom: -50px;
		left: 20px;
		border: 4px solid white;
		border-radius: 50%;
		overflow: hidden;
		height: 150px;
		width: 150px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.verified-badge {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background: var(--color-principal-4);
		color: white;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid white;
		font-size: 14px;
	}

	.profile-info {
		padding: 70px 20px 20px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;
	}

	.provider-info h1 {
		margin: 0;
		font-size: 28px;
		text-align: left;
	}

	.name-container {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.rating {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.stars {
		color: #ffd700;
		letter-spacing: -2px;
	}

	.rating-number {
		color: #666;
	}

	.title {
		color: #666;
		margin: 4px 0;
		font-style: italic;
		font-size: 1.1em;
	}

	.description {
		margin-bottom: 24px;
		line-height: 1.6;
		color: #444;
	}

	.expertise {
		margin-bottom: 24px;
	}

	.expertise h2 {
		font-size: 1.2em;
		margin-bottom: 12px;
		color: #333;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		background: #f0f0f0;
		padding: 6px 12px;
		border-radius: 16px;
		font-size: 0.9em;
		color: #555;
	}

	.stats {
		display: flex;
		gap: 40px;
		border-top: 1px solid #eee;
		padding-top: 24px;
		margin-top: 24px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.number {
		font-size: 24px;
		font-weight: bold;
		color: var(--color-principal-4);
	}

	.label {
		color: #666;
		font-size: 14px;
		margin-top: 4px;
		text-align: center;
	}

	@media (max-width: 768px) {
		.header {
			flex-direction: column;
			gap: 16px;
		}

		.stats {
			flex-direction: column;
			gap: 20px;
			align-items: center;
		}
	}
</style>
