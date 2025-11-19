<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initializeAccessibility } from '$stores/accessibility.js';
	import AccessibilityControls from './components/AccessibilityControls.svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		// Inicializa configurações de acessibilidade
		initializeAccessibility();

		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<!-- Skip to Main Content Link (Acessibilidade) -->
<a href="#main-content" class="skip-to-main">Pular para o conteúdo principal</a>

<!-- Conteúdo Principal -->
<main id="main-content">
	{@render children()}
</main>

<!-- Controles de Acessibilidade -->
<AccessibilityControls />
