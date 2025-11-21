<script>
	import { Button } from 'bits-ui';
	import { ChevronLeft, FileText } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import Contract from '../../../components/Contract.svelte';
	import AccessibilityControls from '../../../components/AccessibilityControls.svelte';

	let { data } = $props();
	let { contract } = $derived(data);
</script>

<!-- Background Gradient -->
<div class="fixed inset-0 -z-10 bg-gradient-to-br from-principal-1 via-principal-2 to-principal-3 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

<!-- Accessibility Controls -->
<AccessibilityControls />

<div class="min-h-screen p-4 sm:p-6 lg:p-8">
	<!-- Header with Back Button -->
	<div class="mb-8">
		<Button.Root
			href="/pv/contratos"
			class="group inline-flex items-center gap-2 rounded-xl bg-white/90 dark:bg-gray-800/90 px-4 py-2 backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg border border-gray-200 dark:border-gray-700"
		>
			<ChevronLeft class="size-5 transition-transform group-hover:-translate-x-1" />
			<span class="font-medium">Voltar</span>
		</Button.Root>
	</div>

	<!-- Hero Section -->
	<div class="mb-8 text-center" in:fade={{ duration: 300 }}>
		<div class="flex items-center justify-center gap-3 mb-4">
			<div class="rounded-xl bg-gradient-to-br from-principal-5 to-principal-6 p-3 shadow-lg">
				<FileText class="size-8 text-white" strokeWidth={2.5} />
			</div>
		</div>
		<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Detalhes do Contrato</h1>
		<p class="text-base sm:text-lg text-gray-600 dark:text-gray-400">Visualize todas as informações do contrato</p>
	</div>

	<!-- Contract Component -->
	<div class="max-w-7xl mx-auto">
		<Contract {contract} />
	</div>
</div>
