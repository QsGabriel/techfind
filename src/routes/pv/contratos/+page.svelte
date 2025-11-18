<script>
	import { Accordion, AlertDialog, Button, Dialog, ScrollArea } from 'bits-ui';
	import { NotebookText, ChevronLeft, Plus, X } from '@lucide/svelte';
	import Contract from '../../components/Contract.svelte';

	let { data } = $props();
	let { contracts, profile } = $derived(data);
	$inspect(contracts);
</script>

<Button.Root
	href="../"
	class="bg-principal-1 hover:bg-principal-4 mt-4 ml-4 inline-block rounded-full border-2 border-black shadow hover:border-black/80"
>
	<ChevronLeft class="size-10 stroke-1 hover:stroke-black/80" />
</Button.Root>

<div class="flex w-full flex-col items-center justify-center gap-8">
	<h2 class="text-2xl font-bold">CONTRATOS</h2>
	<Dialog.Root>
		<Dialog.Trigger
			class="bg-principal-5 hover:bg-principal-3 mt-4 mb-16 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 font-semibold whitespace-nowrap text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
		>
			<Plus strokeWidth={3} /> Criar Contrato</Dialog.Trigger
		>
		<Dialog.Portal>
			<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
			<Dialog.Content
				class="bg-principal-1 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-lg border shadow-sm outline-hidden sm:max-w-2xl"
			>
				<div class="flex items-center justify-center border-b p-5">
					<Dialog.Title class="text-2xl font-bold tracking-tight">
						Criação de Contrato
					</Dialog.Title>
					<Dialog.Close
						class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
					>
						<X class="hover:text-principal-4 size-6 text-black" />
					</Dialog.Close>
				</div>
				<div class="overflow-y-auto p-5">
				<ScrollArea.Root class="overflow-hidden">
					<ScrollArea.Viewport class="h-full max-h-[50rem]">
						<Contract />
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation="vertical"
						class="bg-princical-2 flex w-2.5 touch-none rounded-full border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
					>
						<ScrollArea.Thumb class="bg-principal-4 flex-1 rounded-full" />
					</ScrollArea.Scrollbar>
					<ScrollArea.Scrollbar
						orientation="horizontal"
						class="bg-principal-2 flex w-2.5 touch-none rounded-full border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
					>
						<ScrollArea.Thumb class="bg-principal-4 flex-1 rounded-full" />
					</ScrollArea.Scrollbar>
					<ScrollArea.Corner />
				</ScrollArea.Root>
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

	<div class="mb-15 flex flex-col gap-10">
		{#each contracts as contract (contract.id)}
			<Dialog.Root>
				<Dialog.Trigger
					class="bg-principal-2 hover:bg-principal-3 inline-flex items-center justify-between gap-2 rounded-lg px-5 py-5 font-semibold whitespace-nowrap text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
				>
					<NotebookText strokeWidth={2} />
					<div class="overflow-hidden font-medium italic">
						"{contract.objetivo}"
					</div>
					<div class="text-principal-5">
						{new Date(contract.created_at).toLocaleString('pt-BR')}
					</div>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
					<Dialog.Content
						class="bg-principal-1 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-lg border shadow-sm outline-hidden sm:max-w-2xl"
					>
						<div class="flex items-center justify-center border-b p-5">
							<Dialog.Title class="text-2xl font-bold tracking-tight">
								Informações sobre o contrato
							</Dialog.Title>
							<Dialog.Close
								class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
							>
								<X class="hover:text-principal-4 size-6 text-black" />
							</Dialog.Close>
						</div>
						<div class="overflow-y-auto p-5">
						<ScrollArea.Root class="overflow-hidden">
							<ScrollArea.Viewport class="h-full max-h-[50rem]">
								<Contract {contract} />
							</ScrollArea.Viewport>
							<ScrollArea.Scrollbar
								orientation="vertical"
								class="bg-princical-2 flex w-2.5 touch-none rounded-full border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
							>
								<ScrollArea.Thumb class="bg-principal-4 flex-1 rounded-full" />
							</ScrollArea.Scrollbar>
							<ScrollArea.Scrollbar
								orientation="horizontal"
								class="bg-principal-2 flex w-2.5 touch-none rounded-full border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
							>
								<ScrollArea.Thumb class="bg-principal-4 flex-1 rounded-full" />
							</ScrollArea.Scrollbar>
							<ScrollArea.Corner />
						</ScrollArea.Root>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		{/each}
	</div>
</div>
