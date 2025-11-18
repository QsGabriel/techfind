<script>
	import { Accordion, AlertDialog, Button, Dialog, Label } from 'bits-ui';
	import { ChevronLeft, Plus, X, ChevronDown } from '@lucide/svelte';
	import { superForm } from 'sveltekit-superforms';
	import { fly } from 'svelte/transition';

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

<Button.Root
	href="../"
	class="bg-principal-1 hover:bg-principal-4 mt-4 ml-4 inline-block rounded-full border-2 border-black shadow hover:border-black/80"
>
	<ChevronLeft class="size-10 stroke-1 hover:stroke-black/80" />
</Button.Root>

<div class="mt-24 flex w-full flex-col items-center gap-4">
	<h2 class="text-2xl font-bold">SERVIÇOS</h2>

	<Dialog.Root>
		<Dialog.Trigger
			class="bg-principal-5 hover:bg-principal-3 mt-4 mb-16 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 font-semibold whitespace-nowrap text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
		>
			<Plus strokeWidth={3} /> Criar Serviço</Dialog.Trigger
		>
		<Dialog.Portal>
			<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
			<Dialog.Content
				class="bg-principal-1 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-lg border shadow-sm outline-hidden sm:max-w-[490px] md:w-full"
			>
				<div class="flex items-center justify-center border-b p-5">
					<Dialog.Title class="text-2xl font-bold tracking-tight">
						Criação de Serviço
					</Dialog.Title>
					<Dialog.Close
						class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
					>
						<X class="hover:text-principal-4 size-6 text-black" />
					</Dialog.Close>
				</div>
				<div class="overflow-y-auto p-5">
					{@render service()}
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

	<Accordion.Root
		orientation="vertical"
		type="multiple"
		class="flex w-full flex-col gap-4 sm:max-w-2/5"
	>
		{#each data.services as service}
			<Accordion.Item
				class="flex flex-col items-center gap-8 rounded-md border-2 border-black px-2 py-2 shadow sm:px-8 sm:py-4"
			>
				<Accordion.Header class="w-full">
					<Accordion.Trigger
						class="border-principal-5 flex w-full items-center justify-between gap-2 [&[data-state=open]>span>svg]:rotate-180"
					>
						<h3 class="border-principal-5 border-b-4 text-lg font-bold">
							{service.titulo}
						</h3>
						<h4 class="font-semibold">
							Criado em:
							<span class="text-principal-6 font-semibold">
								{new Date(service.criado_em).toLocaleString('pt-BR', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: false // Use formato 24 horas
								})}
							</span>
						</h4>
						<span
							class="hover:bg-principal-2 inline-flex size-8 items-center justify-center rounded-[7px]"
						>
							<ChevronDown class=" transition-transform duration-200 " />
						</span>
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content class="flex w-full flex-col items-center justify-around gap-4">
					<div class="text-md overflow-hidden text-justify">"{service.descricao}"</div>
					<div class="flex items-center gap-2">
						<p class="font-bold">PREÇO:</p>
						<span class="bg-principal-5 rounded-md px-4 py-2 font-semibold"
							>R$: {service.preco}</span
						>
					</div>

					<div class="self-end">
						<AlertDialog.Root>
							<AlertDialog.Trigger
								class="bg-principal-5 hover:bg-principal-3 rounded-md px-2 py-2 shadow transition-colors duration-300"
								><X strokeWidth={3} /></AlertDialog.Trigger
							>
							<AlertDialog.Portal>
								<AlertDialog.Overlay class="fixed inset-0 z-50 bg-black/40" />
								<AlertDialog.Content
									class="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-white p-7 shadow outline-hidden sm:max-w-lg md:w-full overflow-y-auto"
								>
									<AlertDialog.Title class="text-lg font-semibold tracking-tight uppercase"
										>Deletar Serviço</AlertDialog.Title
									>
									<AlertDialog.Description class="text-md font-semibold text-black/50"
										>Tem certeza que deseja deletar esse serviço?</AlertDialog.Description
									>
									<form method="POST" action="?/deleteService">
										<input type="hidden" name="servicoId" value={service.id} />
										<div class="mt-4 flex w-full items-center justify-center gap-4">
											<AlertDialog.Cancel
												type="button"
												class="inline-flex w-full items-center justify-center rounded-md bg-black/90 py-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-black/50 active:scale-[0.98]"
												>Cancelar</AlertDialog.Cancel
											>
											<AlertDialog.Action
												type="submit"
												value={service}
												class="inline-flex w-full items-center justify-center rounded-md bg-red-600/80 py-4 text-sm font-medium shadow-sm transition-all hover:bg-red-600/50 active:scale-[0.98]"
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
