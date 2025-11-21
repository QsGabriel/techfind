<script>
	import { Button } from 'bits-ui';
	import { FileText, ChevronLeft, Plus, Sparkles } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
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
			<Button.Root
				href="/pv/contratos/criar"
				class="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-principal-5 to-principal-6 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
			>
				<Plus class="size-5" strokeWidth={2.5} />
				<span>Criar Novo Contrato</span>
			</Button.Root>
		</div>

	<!-- Contracts List -->
	<div class="space-y-4">
		{#each contracts as contract (contract.id)}
			<Button.Root
				href="/pv/contratos/{contract.id}"
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
				</Button.Root>
		{/each}
	</div>
	</div>
</div>
