<script lang="ts">
	import { HelpCircle, X } from '@lucide/svelte';
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import HelpCenter from './help-center/HelpCenter.svelte';

	let showHelpCenter = $state(false);
	let isVisible = $state(false);

	onMount(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			
			// Mostra o botão após 200px de scroll
			const hasScrolledEnough = scrollPosition > 200;
			
			// Oculta o botão quando estiver próximo do footer (últimos 300px)
			const isNearFooter = scrollPosition + windowHeight >= documentHeight - 300;
			
			isVisible = hasScrolledEnough && !isNearFooter;
		};

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleScroll);
		handleScroll(); // Verifica a posição inicial

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	});

	function toggleHelpCenter() {
		showHelpCenter = !showHelpCenter;
	}
</script>

<!-- Botão Flutuante -->
{#if isVisible}
	<div class="fixed bottom-6 right-6 z-40" transition:scale={{ duration: 300 }}>
		<!-- Tooltip -->
		<div
			class="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-lg group-hover:block"
		>
			Precisa de ajuda?
			<div class="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-gray-800"></div>
		</div>

		<!-- Botão -->
		<button
			type="button"
			onclick={toggleHelpCenter}
			class="group flex h-16 w-16 items-center justify-center rounded-full bg-principal-4 shadow-2xl shadow-principal-4/50 transition-all duration-300 hover:scale-110 hover:bg-principal-5 hover:shadow-principal-5/60"
			aria-label="Abrir Central de Ajuda"
		>
			<HelpCircle size={32} class="text-white" />
			<!-- Badge de notificação -->
			<span
				class="absolute -top-1 right-0 flex h-4 w-4 animate-ping rounded-full bg-red-500 opacity-75"
			></span>
			<span class="absolute -top-1 right-0 flex h-4 w-4 rounded-full bg-red-500"></span>
		</button>
	</div>
{/if}

<!-- Modal da Central de Ajuda -->
{#if showHelpCenter}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={(e) => {
			if (e.target === e.currentTarget) toggleHelpCenter();
		}}
		role="dialog"
		aria-modal="true"
		aria-labelledby="help-center-title"
		tabindex="-1"
	>
		<div
			class="relative max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
			transition:fade={{ duration: 300, delay: 100 }}
		>
			<button
				type="button"
				onclick={toggleHelpCenter}
				class="hover:bg-principal-4 sticky right-4 top-4 z-10 ml-auto mr-4 mt-4 flex rounded-full bg-gray-100 p-2 text-gray-600 transition-all duration-200 hover:text-white"
				aria-label="Fechar Central de Ajuda"
			>
				<X size={24} />
			</button>
			<HelpCenter />
		</div>
	</div>
{/if}
