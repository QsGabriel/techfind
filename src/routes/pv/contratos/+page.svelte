<script>
	import { Accordion, AlertDialog, Button, Dialog, ScrollArea } from 'bits-ui';
	import { FileText, ChevronLeft, Plus, X, Sparkles } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import Contract from '../../components/Contract.svelte';
	import AccessibilityControls from '../../components/AccessibilityControls.svelte';

	let { data } = $props();
	let { contracts, profile } = $derived(data);
	$inspect(contracts);
</script>

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
				<FileText class="size-8 text-white" strokeWidth={2.5} />
			</div>
		</div>
		<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">Meus Contratos</h1>
		<p class="text-lg text-gray-600 dark:text-gray-400">Gerencie seus contratos profissionais</p>
	</div>

	<!-- Container -->
	<div class="max-w-5xl mx-auto space-y-8">
		<!-- Create Contract Button -->
		<div class="flex justify-center mb-8">
			<Dialog.Root>
				<Dialog.Trigger
					class="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-principal-5 to-principal-6 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
				>
					<Plus class="size-5" strokeWidth={2.5} />
					<span>Criar Novo Contrato</span>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
					<Dialog.Content
						class="fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl outline-hidden sm:max-w-2xl"
					>
						<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
							<Dialog.Title class="text-2xl font-bold text-gray-900 dark:text-white">
								Novo Contrato
							</Dialog.Title>
							<Dialog.Close
								class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
							>
								<X class="size-5 text-gray-500 dark:text-gray-400" />
							</Dialog.Close>
						</div>
						<div class="overflow-y-auto p-6">
							<ScrollArea.Root class="overflow-hidden">
								<ScrollArea.Viewport class="h-full max-h-[50rem]">
									<Contract />
								</ScrollArea.Viewport>
								<ScrollArea.Scrollbar
									orientation="vertical"
									class="flex w-2.5 touch-none rounded-full bg-gray-200 dark:bg-gray-700 border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
								>
									<ScrollArea.Thumb class="flex-1 rounded-full bg-principal-5" />
								</ScrollArea.Scrollbar>
								<ScrollArea.Scrollbar
									orientation="horizontal"
									class="flex w-2.5 touch-none rounded-full bg-gray-200 dark:bg-gray-700 border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
								>
									<ScrollArea.Thumb class="flex-1 rounded-full bg-principal-5" />
								</ScrollArea.Scrollbar>
								<ScrollArea.Corner />
							</ScrollArea.Root>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>

	<!-- Contracts List -->
	<div class="space-y-4">
		{#each contracts as contract (contract.id)}
			<Dialog.Root>
				<Dialog.Trigger
					class="w-full rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all p-6 text-left group"
				>
					<div class="flex items-start gap-4">
							<div class="rounded-lg bg-gradient-to-br from-principal-5 to-principal-6 p-3 shadow group-hover:scale-110 transition-transform">
								<FileText class="size-6 text-white" strokeWidth={2} />
							</div>
							<div class="flex-1 min-w-0">
								<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
									{contract.objetivo}
								</h3>
								<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
									<Sparkles class="size-4" />
									<span>
										{new Date(contract.created_at).toLocaleString('pt-BR')}
									</span>
								</div>
							</div>
						</div>
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
						<Dialog.Content
							class="fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl outline-hidden sm:max-w-2xl"
						>
							<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
								<Dialog.Title class="text-2xl font-bold text-gray-900 dark:text-white">
									Detalhes do Contrato
								</Dialog.Title>
								<Dialog.Close
									class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
								>
									<X class="size-5 text-gray-500 dark:text-gray-400" />
								</Dialog.Close>
							</div>
							<div class="overflow-y-auto p-6">
								<ScrollArea.Root class="overflow-hidden">
									<ScrollArea.Viewport class="h-full max-h-[50rem]">
										<Contract {contract} />
									</ScrollArea.Viewport>
									<ScrollArea.Scrollbar
										orientation="vertical"
										class="flex w-2.5 touch-none rounded-full bg-gray-200 dark:bg-gray-700 border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
									>
										<ScrollArea.Thumb class="flex-1 rounded-full bg-principal-5" />
									</ScrollArea.Scrollbar>
									<ScrollArea.Scrollbar
										orientation="horizontal"
										class="flex w-2.5 touch-none rounded-full bg-gray-200 dark:bg-gray-700 border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
									>
										<ScrollArea.Thumb class="flex-1 rounded-full bg-principal-5" />
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
</div>
