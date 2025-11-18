<script lang="ts">
	import { HelpCircle, Filter } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import SearchBox from './SearchBox.svelte';
	import CategoryCard from './CategoryCard.svelte';
	import FaqAccordion from './FaqAccordion.svelte';
	import SupportButton from './SupportButton.svelte';
	import { categories, faqs } from './helpData.js';

	let searchQuery = $state('');
	let selectedCategory = $state<string | null>(null);
	let openFaqId = $state<number | null>(null);

	// Filtra FAQs baseado na busca e categoria selecionada
	let filteredFaqs = $derived.by(() => {
		let result = faqs;

		// Filtrar por categoria
		if (selectedCategory) {
			result = result.filter((faq) => faq.category === selectedCategory);
		}

		// Filtrar por busca
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(faq) =>
					faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
			);
		}

		return result;
	});

	function handleCategoryClick(categoryId: string) {
		if (selectedCategory === categoryId) {
			selectedCategory = null;
		} else {
			selectedCategory = categoryId;
			searchQuery = '';
			openFaqId = null;
		}
	}

	function handleSearch(value: string) {
		searchQuery = value;
		selectedCategory = null;
		openFaqId = null;
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = null;
		openFaqId = null;
	}
</script>

<section class="w-full bg-gradient-to-br from-principal-1 via-white to-principal-1 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-12 text-center" in:fade={{ duration: 300 }}>
			<div class="mb-4 flex items-center justify-center gap-3">
				<div class="rounded-full bg-principal-4 p-3">
					<HelpCircle size={32} class="text-white" />
				</div>
			</div>
			<h1 class="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">Central de Ajuda</h1>
			<p class="mx-auto max-w-2xl text-lg font-medium text-gray-600">
				Encontre respostas rápidas para suas dúvidas ou entre em contato com nossa equipe
			</p>
		</div>

		<!-- Search Box -->
		<div class="mb-12" in:fly={{ y: 20, duration: 400, delay: 100 }}>
			<SearchBox bind:value={searchQuery} onSearch={handleSearch} />
		</div>

		<!-- Active Filters Info -->
		{#if searchQuery || selectedCategory}
			<div
				class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-principal-2 p-4"
				transition:fade={{ duration: 200 }}
			>
				<div class="flex items-center gap-2">
					<Filter size={20} class="text-principal-6" />
					<span class="font-bold text-gray-800">
						{filteredFaqs.length}
						{filteredFaqs.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
					</span>
				</div>
				<button
					type="button"
					onclick={clearFilters}
					class="rounded-lg bg-white px-4 py-2 font-bold text-principal-6 shadow-sm transition-all duration-200 hover:bg-principal-3 hover:shadow-md"
				>
					Limpar filtros
				</button>
			</div>
		{/if}

		<!-- Categories -->
		{#if !searchQuery}
			<div class="mb-12" in:fly={{ y: 20, duration: 400, delay: 200 }}>
				<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Escolha uma Categoria</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
					{#each categories as category (category.id)}
						<CategoryCard
							{category}
							isActive={selectedCategory === category.id}
							onClick={() => handleCategoryClick(category.id)}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<!-- FAQs -->
		<div in:fly={{ y: 20, duration: 400, delay: 300 }}>
			<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">
				{selectedCategory
					? `Perguntas sobre ${categories.find((c) => c.id === selectedCategory)?.title}`
					: searchQuery
						? 'Resultados da Busca'
						: 'Perguntas Frequentes'}
			</h2>

			{#if filteredFaqs.length > 0}
				<div class="mx-auto max-w-4xl space-y-4">
					{#each filteredFaqs as faq (faq.id)}
						<div in:fade={{ duration: 200, delay: faq.id * 50 }}>
							<FaqAccordion
								{faq}
								isOpen={openFaqId === faq.id}
								onToggle={() => (openFaqId = openFaqId === faq.id ? null : faq.id)}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<div
					class="mx-auto max-w-2xl rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center"
					transition:fade={{ duration: 300 }}
				>
					<p class="text-lg font-bold text-gray-600">
						Nenhuma pergunta encontrada para "{searchQuery}"
					</p>
					<p class="mt-2 font-medium text-gray-500">
						Tente usar outros termos ou navegue pelas categorias acima
					</p>
				</div>
			{/if}
		</div>

		<!-- Support Button -->
		<div class="mt-12" in:fly={{ y: 20, duration: 400, delay: 400 }}>
			<SupportButton />
		</div>
	</div>
</section>
