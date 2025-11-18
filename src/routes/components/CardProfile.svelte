<script lang="ts">
	let { usuarios } = $props();
	import { CircleUserRound, Cpu, X, Send } from '@lucide/svelte';
	import { ScrollArea, Dialog, Button } from 'bits-ui';
</script>

{#snippet usuarioContato(usuario)}
	<Dialog.Root>
		<Dialog.Trigger
			class="bg-principal-5 hover:bg-principal-3 inline-flex h-12 items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
		>
			<Cpu /> Visualizar Perfil
		</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
			<Dialog.Content
				class="bg-principal-1 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col gap-8 rounded-lg border p-5 shadow-sm outline-hidden sm:max-w-[490px] md:w-full"
			>
				<Dialog.Title class="flex w-full items-center justify-center tracking-tight">
					<div class="flex flex-col items-center justify-between">
						<CircleUserRound size="64" />
						<h3 class="text-2xl font-bold">{usuario.nome}</h3>
						<h2 class="text-xl font-semibold">{usuario.caract}</h2>
					</div>
				</Dialog.Title>
				<ul class="flex flex-wrap justify-center gap-2">
					{#each usuario.tags.split('-').sort() as tag}
						<li class="rounded-lg bg-zinc-200 px-2 font-semibold">{tag}</li>
					{/each}
				</ul>
				<div class="flex flex-col items-center justify-center gap-1">
					<h4 class="font-bold">Disponibilidade</h4>
					<p class="rounded-lg bg-zinc-200 px-2 font-semibold">
						{new Date(usuario.date).toLocaleDateString('pt-BR')}
					</p>
				</div>
				<p class="rounded-lg bg-zinc-200 p-2 text-justify">"{usuario.desc}"</p>
				<Dialog.Close
					class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
				>
					<X class="hover:text-principal-4 size-6 text-black" />
				</Dialog.Close>
				<Button.Root
					href="./userPage?user={usuario.id}"
					class="bg-principal-4 hover:bg-principal-3 flex gap-4 rounded-md px-8 py-4 font-semibold shadow transition-colors duration-300"
				>
					<Send /> Visualizar Perfil
				</Button.Root>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/snippet}

{#snippet usuarioCard(usuario)}
	<div class="flex flex-1 flex-col gap-8 rounded-xl bg-white p-4 md:p-8">
		<div class="flex gap-4">
			<CircleUserRound size="64" />
			<div>
				<h2 class="text-xl font-bold">{usuario.name}</h2>
				<h3 class="font-medium">{usuario.caract}</h3>
			</div>
		</div>
		<ul class="flex flex-wrap items-center justify-center gap-4">
			{#each usuario.tags.split('-').sort() as tag}
				<li class="rounded-lg bg-zinc-200 px-2 font-semibold">{tag}</li>
			{/each}
		</ul>
		{@render usuarioContato(usuario)}
	</div>
{/snippet}

<ScrollArea.Root
	type="always"
	class="flex h-full justify-center overflow-hidden rounded-xl bg-zinc-400 px-2 py-4 shadow-xl md:px-16 md:py-8"
>
	<ScrollArea.Viewport class="h-full w-full max-w-md">
		{#if usuarios}
			<div class="flex flex-col items-center justify-center gap-8">
				{#each usuarios as usuario}
					{@render usuarioCard(usuario)}
				{/each}
			</div>
		{:else}
			<h3 class="text-principal-2 text-center text-2xl font-bold">
				não há usuários com essas informações... por favor tente novamente!!!
			</h3>
		{/if}
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="vertical"
		class="my-1 mr-1.5 hidden w-3 touch-none rounded-full border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3 lg:flex"
	>
		<ScrollArea.Thumb class="bg-principal-4 flex-1 rounded-full" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar orientation="horizontal">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
