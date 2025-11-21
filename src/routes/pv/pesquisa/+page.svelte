<script lang="ts">
	import { Button, ScrollArea } from 'bits-ui';
	import { marked } from 'marked';
	import CardProfile from '../../components/CardProfile.svelte';
	import CardPesquisa from '../../components/CardPesquisa.svelte';
	import AccessibilityControls from '../../components/AccessibilityControls.svelte';
	import { ChevronLeft, Sparkles, Users, Search } from '@lucide/svelte';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props();
	let api = JSON.parse(data.api);

	const markdown = api.description ? marked.parse(api.description) : '';
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-principal-1/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
	<!-- Back Button -->
	<div class="p-4 lg:p-6">
		<Button.Root
			href="/pv"
			class="group inline-flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-4 py-2.5 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-xl hover:ring-principal-5 hover:-translate-x-1"
		>
			<ChevronLeft class="h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:-translate-x-1" />
			<span class="font-semibold text-gray-700 dark:text-gray-200">Voltar</span>
		</Button.Root>
	</div>

	<!-- Main Content -->
	<div class="mx-auto max-w-7xl px-4 pb-8 lg:px-6">
		<div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
			<!-- AI Response Section -->
			<div 
				class="flex flex-col gap-6"
				transition:fly={{ x: -20, duration: 600 }}
			>
				<!-- Header -->
				<div class="flex items-center gap-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-principal-5 to-principal-6 shadow-lg">
						<Sparkles class="h-6 w-6 text-white" />
					</div>
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
						Análise da IA
					</h1>
				</div>

				<!-- Response Card -->
				<div class="flex flex-col gap-6 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 lg:p-8">
					<ScrollArea.Root class="overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900/50 p-6">
						<ScrollArea.Viewport class="max-h-[400px] lg:max-h-[500px]">
							{#if markdown}
								<div 
									id="markdown" 
									class="prose prose-sm dark:prose-invert max-w-none"
									transition:fade={{ duration: 300 }}
								>
									{@html marked.parse(markdown)}
								</div>
							{:else}
								<div class="flex flex-col items-center justify-center py-16 text-center">
									<div class="mb-4 rounded-full bg-principal-5/10 dark:bg-principal-5/20 p-6">
										<Search class="h-12 w-12 text-principal-5" />
									</div>
									<h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
										Nenhuma Pesquisa Realizada
									</h2>
									<p class="text-gray-600 dark:text-gray-400">
										Preencha o formulário abaixo para começar sua busca
									</p>
								</div>
							{/if}
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar
							orientation="vertical"
							class="my-1 w-2.5 touch-none rounded-full bg-gray-200 dark:bg-gray-700 p-px transition-all duration-200 hover:w-3 hover:bg-principal-4 dark:hover:bg-principal-5"
						>
							<ScrollArea.Thumb class="flex-1 rounded-full bg-principal-5 dark:bg-principal-4" />
						</ScrollArea.Scrollbar>
						<ScrollArea.Corner />
					</ScrollArea.Root>

					<!-- Search Form -->
					<div>
						<CardPesquisa />
					</div>
				</div>
			</div>

			<!-- Results Section -->
			{#if markdown}
				<div 
					class="flex flex-col gap-6"
					transition:fly={{ x: 20, duration: 600, delay: 200 }}
				>
					<!-- Header -->
					<div class="flex items-center gap-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-principal-5 to-principal-6 shadow-lg">
							<Users class="h-6 w-6 text-white" />
						</div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
							Profissionais Encontrados
						</h2>
					</div>

					<!-- Results Card -->
					<div class="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 lg:p-8">
						<CardProfile usuarios={api.usuarios} />
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Accessibility Controls -->
<AccessibilityControls />

<style>
	/* Markdown Styling with Tailwind-compatible custom properties */
	#markdown :global(h1) {
		font-size: 1.5rem;
		font-weight: 700;
		color: rgb(17 24 39);
		margin-bottom: 1rem;
		margin-top: 1.5rem;
	}

	:global(.dark) #markdown :global(h1) {
		color: rgb(255 255 255);
	}

	#markdown :global(h2) {
		font-size: 1.25rem;
		font-weight: 700;
		color: rgb(31 41 55);
		margin-bottom: 0.75rem;
		margin-top: 1.25rem;
	}

	:global(.dark) #markdown :global(h2) {
		color: rgb(243 244 246);
	}

	#markdown :global(h3) {
		font-size: 1.125rem;
		font-weight: 600;
		color: rgb(31 41 55);
		margin-bottom: 0.5rem;
		margin-top: 1rem;
	}

	:global(.dark) #markdown :global(h3) {
		color: rgb(229 231 235);
	}

	#markdown :global(h4) {
		font-size: 1rem;
		font-weight: 600;
		color: rgb(55 65 81);
		margin-bottom: 0.5rem;
		margin-top: 0.75rem;
	}

	:global(.dark) #markdown :global(h4) {
		color: rgb(209 213 219);
	}

	#markdown :global(p) {
		color: rgb(55 65 81);
		margin-bottom: 1rem;
		line-height: 1.625;
	}

	:global(.dark) #markdown :global(p) {
		color: rgb(209 213 219);
	}

	#markdown :global(ul),
	#markdown :global(ol) {
		margin-top: 1rem;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	#markdown :global(ul) {
		list-style-type: disc;
	}

	#markdown :global(ol) {
		list-style-type: decimal;
	}

	#markdown :global(li) {
		color: rgb(55 65 81);
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	:global(.dark) #markdown :global(li) {
		color: rgb(209 213 219);
	}

	#markdown :global(code) {
		background-color: rgba(99, 102, 241, 0.1);
		color: rgb(79, 70, 229);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-family: ui-monospace, monospace;
		font-size: 0.875rem;
	}

	:global(.dark) #markdown :global(code) {
		background-color: rgba(99, 102, 241, 0.2);
		color: rgb(165, 180, 252);
	}

	#markdown :global(pre) {
		background-color: rgb(31 41 55);
		padding: 1rem;
		border-radius: 0.75rem;
		overflow-x: auto;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	:global(.dark) #markdown :global(pre) {
		background-color: rgb(3 7 18);
	}

	#markdown :global(pre code) {
		background-color: transparent;
		color: rgb(243 244 246);
		padding: 0;
	}

	#markdown :global(blockquote) {
		border-left-width: 4px;
		border-color: rgb(99 102 241);
		padding-left: 1rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
		color: rgb(107 114 128);
		font-style: italic;
	}

	:global(.dark) #markdown :global(blockquote) {
		color: rgb(156 163 175);
	}

	#markdown :global(a) {
		color: rgb(79 70 229);
		text-decoration: underline;
		transition: color 0.2s;
	}

	#markdown :global(a:hover) {
		color: rgb(99 102 241);
	}

	:global(.dark) #markdown :global(a) {
		color: rgb(129 140 248);
	}

	:global(.dark) #markdown :global(a:hover) {
		color: rgb(165 180 252);
	}

	#markdown :global(strong) {
		font-weight: 700;
		color: rgb(17 24 39);
	}

	:global(.dark) #markdown :global(strong) {
		color: rgb(255 255 255);
	}

	#markdown :global(em) {
		font-style: italic;
	}

	#markdown :global(hr) {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		border-color: rgb(209 213 219);
	}

	:global(.dark) #markdown :global(hr) {
		border-color: rgb(75 85 99);
	}

	#markdown :global(table) {
		width: 100%;
		margin-top: 1rem;
		margin-bottom: 1rem;
		border-collapse: collapse;
	}

	#markdown :global(th),
	#markdown :global(td) {
		border: 1px solid rgb(209 213 219);
		padding: 0.5rem 1rem;
	}

	:global(.dark) #markdown :global(th),
	:global(.dark) #markdown :global(td) {
		border-color: rgb(75 85 99);
	}

	#markdown :global(th) {
		background-color: rgb(243 244 246);
		font-weight: 600;
		color: rgb(17 24 39);
	}

	:global(.dark) #markdown :global(th) {
		background-color: rgb(55 65 81);
		color: rgb(255 255 255);
	}

	#markdown :global(td) {
		color: rgb(55 65 81);
	}

	:global(.dark) #markdown :global(td) {
		color: rgb(209 213 219);
	}

	#markdown :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}
</style>
