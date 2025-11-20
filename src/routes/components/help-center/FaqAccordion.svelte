<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		faq: {
			id: number;
			question: string;
			answer: string;
			category: string;
		};
		isOpen?: boolean;
		onToggle?: () => void;
	}

	let { faq, isOpen = $bindable(false), onToggle }: Props = $props();

	function handleToggle() {
		isOpen = !isOpen;
		if (onToggle) {
			onToggle();
		}
	}
</script>

<div class="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm transition-all duration-300">
	<button
		type="button"
		onclick={handleToggle}
		class="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-600"
		aria-expanded={isOpen}
		aria-controls="faq-answer-{faq.id}"
	>
		<h3 class="flex-1 text-base font-bold text-gray-800 dark:text-gray-100 md:text-lg">
			{faq.question}
		</h3>
		<div
			class="flex-shrink-0 transition-transform duration-300 {isOpen ? 'rotate-180' : 'rotate-0'}"
		>
			<ChevronDown size={24} class="text-principal-4" />
		</div>
	</button>

	{#if isOpen}
		<div
			id="faq-answer-{faq.id}"
			class="border-t-2 border-gray-100 dark:border-gray-600 px-5 py-4"
			transition:slide={{ duration: 300 }}
		>
			<p class="font-medium leading-relaxed text-gray-600 dark:text-gray-300">
				{faq.answer}
			</p>
		</div>
	{/if}
</div>
