<script>
	import { Accordion, AlertDialog, Button, Dialog, Label, ScrollArea } from 'bits-ui';
	import { ChevronLeft, Plus, X, ChevronDown, Briefcase, DollarSign, Sparkles } from '@lucide/svelte';
	import { superForm } from 'sveltekit-superforms';
	import { fly, fade } from 'svelte/transition';
	import AccessibilityControls from '../../components/AccessibilityControls.svelte';

	let { data } = $props();
	const { errors } = superForm(data.form);
</script>

{#snippet service()}
	<form method="POST" action="?/insertService">
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="titulo" class="text-sm font-medium">Título:</Label.Root>
			<div class="w-full">
				<input
					type="text"
					name="titulo"
					aria-invalid={$errors.titulo ? 'true' : undefined}
					class="bg-principal-1 line inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
			{#if $errors.titulo}<span class="mt-1 pl-2 font-bold text-red-500">{$errors.titulo}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="descricao" class="text-sm font-medium">Descrição:</Label.Root>
			<div class="w-full">
				<input
					type="text"
					name="descricao"
					aria-invalid={$errors.descricao ? 'true' : undefined}
					class="bg-principal-1 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
			{#if $errors.descricao}<span class="mt-1 pl-2 font-bold text-red-500"
					>{$errors.descricao}</span
				>{/if}
		</div>
		<div class="mb-8 flex flex-col items-start gap-1 py-4">
			<Label.Root for="preco" class="text-sm font-medium">Preço:</Label.Root>
			<div class="w-full">
				<input
					type="number"
					step="0.01"
					name="preco"
					aria-invalid={$errors.preco ? 'true' : undefined}
					class="bg-principal-1 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
			{#if $errors.preco}<span class="mt-1 pl-2 font-bold text-red-500">{$errors.preco}</span>{/if}
		</div>
		<div class="flex w-full flex-col items-center gap-4">
			<button
				class="bg-principal-5 hover:bg-principal-3 mb-4 inline-flex h-10 w-2/3 items-center justify-center rounded-lg px-12 py-6 font-semibold text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
			>
				Entrar
			</button>
			{#if $errors._errors && !($errors.titulo || $errors.descricao)}
				<span class="font-bold text-red-500" in:fly={{ x: 200, duration: 1000 }}>
					{$errors._errors}
				</span>
			{/if}
		</div>
	</form>
{/snippet}

<!-- Background Gradient -->
<div class="fixed inset-0 -z-10 bg-gradient-to-br from-principal-1 via-principal-2 to-principal-3 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

<!-- Accessibility Controls -->
<AccessibilityControls />

<div class="min-h-screen p-4 sm:p-6 lg:p-8">
	<!-- Header with Back Button -->
	<div class="mb-8">
		<Button.Root
			href="/pv"
			class="group inline-flex items-center gap-2 rounded-xl bg-white/90 dark:bg-gray-800/90 px-4 py-2 backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg border border-gray-200 dark:border-gray-700"
		>
			<ChevronLeft class="size-5 transition-transform group-hover:-translate-x-1" />
			<span class="font-medium">Voltar</span>
		</Button.Root>
	</div>

	<!-- Hero Section -->
	<div class="mb-12 text-center" in:fade={{ duration: 300 }}>
		<div class="flex items-center justify-center gap-3 mb-4">
			<div class="rounded-xl bg-gradient-to-br from-principal-5 to-principal-6 p-3 shadow-lg">
				<Briefcase class="size-8 text-white" strokeWidth={2.5} />
			</div>
		</div>
		<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">Meus Serviços</h1>
		<p class="text-lg text-gray-600 dark:text-gray-400">Gerencie seus serviços oferecidos</p>
	</div>

	<!-- Container -->
	<div class="max-w-5xl mx-auto space-y-8">

		<!-- Create Service Button -->
		<div class="flex justify-center mb-8">
			<Dialog.Root>
				<Dialog.Trigger
					class="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-principal-5 to-principal-6 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
				>
					<Plus class="size-5" strokeWidth={2.5} />
					<span>Criar Novo Serviço</span>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
					<Dialog.Content
						class="fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl outline-hidden sm:max-w-[490px] md:w-full"
					>
						<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
							<Dialog.Title class="text-2xl font-bold text-gray-900 dark:text-white">
								Novo Serviço
							</Dialog.Title>
							<Dialog.Close
								class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
							>
								<X class="size-5 text-gray-500 dark:text-gray-400" />
							</Dialog.Close>
						</div>
						<div class="overflow-y-auto p-6">
							{@render service()}
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>

		<!-- Services List -->
		<Accordion.Root
			orientation="vertical"
			type="multiple"
			class="space-y-4"
		>
			{#each data.services as service}
				<Accordion.Item
					class="rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all overflow-hidden"
				>
					<Accordion.Header class="w-full">
						<Accordion.Trigger
							class="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 [&[data-state=open]>span>svg]:rotate-180"
						>
							<div class="flex items-center gap-3 flex-1 min-w-0">
								<div class="rounded-lg bg-gradient-to-br from-principal-5 to-principal-6 p-2 shadow">
									<Briefcase class="size-5 text-white" />
								</div>
								<div class="flex-1 min-w-0">
									<h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">
										{service.titulo}
									</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400">
										{new Date(service.criado_em).toLocaleString('pt-BR', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
											hour12: false
										})}
									</p>
								</div>
							</div>
							<span class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
								<ChevronDown class="size-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
							</span>
						</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content class="px-6 pb-6 space-y-4">
						<div class="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700">
							<p class="text-gray-700 dark:text-gray-300 leading-relaxed">"{service.descricao}"</p>
						</div>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<DollarSign class="size-5 text-principal-6" />
								<span class="text-sm font-medium text-gray-600 dark:text-gray-400">Preço</span>
							</div>
							<span class="rounded-lg bg-gradient-to-r from-principal-5 to-principal-6 px-4 py-2 font-bold text-white shadow">
								R$ {service.preco}
							</span>
						</div>

						<div class="flex justify-end">
							<AlertDialog.Root>
								<AlertDialog.Trigger
									class="inline-flex items-center gap-2 rounded-lg bg-red-500/90 hover:bg-red-600 px-4 py-2 font-medium text-white shadow transition-all hover:shadow-lg active:scale-95"
								>
									<X class="size-4" />
									<span>Deletar</span>
								</AlertDialog.Trigger>
								<AlertDialog.Portal>
									<AlertDialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
									<AlertDialog.Content
										class="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-2xl outline-hidden sm:max-w-lg md:w-full overflow-y-auto"
									>
										<AlertDialog.Title class="text-xl font-bold text-gray-900 dark:text-white"
											>Deletar Serviço</AlertDialog.Title
										>
										<AlertDialog.Description class="text-gray-600 dark:text-gray-400"
											>Tem certeza que deseja deletar esse serviço? Esta ação não pode ser desfeita.</AlertDialog.Description
										>
										<form method="POST" action="?/deleteService">
											<input type="hidden" name="servicoId" value={service.id} />
											<div class="mt-4 flex w-full items-center justify-center gap-3">
												<AlertDialog.Cancel
													type="button"
													class="inline-flex w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 py-3 px-4 font-medium text-gray-900 dark:text-white shadow transition-all hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
													>Cancelar</AlertDialog.Cancel
												>
												<AlertDialog.Action
													type="submit"
													value={service}
													class="inline-flex w-full items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 py-3 px-4 font-medium text-white shadow transition-all active:scale-95"
													>Confirmar</AlertDialog.Action
												>
											</div>
										</form>
									</AlertDialog.Content>
								</AlertDialog.Portal>
							</AlertDialog.Root>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</div>
