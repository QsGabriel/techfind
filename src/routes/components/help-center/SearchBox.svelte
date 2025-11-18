<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		value?: string;
		onSearch?: (value: string) => void;
		placeholder?: string;
	}

	let { value = $bindable(''), onSearch, placeholder = 'Buscar perguntas frequentes...' }: Props =
		$props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		if (onSearch) {
			onSearch(value);
		}
	}

	function clearSearch() {
		value = '';
		if (onSearch) {
			onSearch('');
		}
	}
</script>

<div class="relative w-full">
	<div class="relative flex items-center">
		<Search
			class="pointer-events-none absolute left-4 text-gray-400"
			size={20}
			aria-hidden="true"
		/>
		<input
			type="text"
			{value}
			oninput={handleInput}
			{placeholder}
			class="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-12 font-medium text-gray-700 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-principal-4 focus:outline-none focus:ring-2 focus:ring-principal-4/20"
			aria-label="Campo de busca"
		/>
		{#if value.length > 0}
			<button
				type="button"
				onclick={clearSearch}
				class="hover:bg-principal-4/10 absolute right-4 rounded-full p-1 text-gray-400 transition-all duration-200 hover:text-principal-4"
				aria-label="Limpar busca"
				transition:fade={{ duration: 150 }}
			>
				<X size={18} />
			</button>
		{/if}
	</div>
</div>
