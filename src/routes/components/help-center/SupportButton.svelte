<script lang="ts">
	import { MessageCircle, ArrowRight } from '@lucide/svelte';

	interface Props {
		href?: string;
		text?: string;
		subtext?: string;
	}

	let {
		href = '/#support',
		text = 'Ainda precisa de ajuda?',
		subtext = 'Fale com nosso suporte'
	}: Props = $props();
</script>

<div class="w-full rounded-xl border-2 border-dashed border-principal-4/40 bg-principal-1 p-6">
	<div class="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
		<div
			class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-principal-4"
		>
			<MessageCircle size={32} class="text-white" />
		</div>

		<div class="flex-1">
			<h3 class="text-xl font-bold text-gray-800">{text}</h3>
			<p class="mt-1 font-medium text-gray-600">{subtext}</p>
		</div>

		<a
			{href}
			class="group flex items-center gap-2 rounded-xl bg-principal-4 px-6 py-3 font-bold text-white shadow-lg shadow-principal-4/30 transition-all duration-300 hover:bg-principal-5 hover:shadow-xl hover:shadow-principal-5/40"
		>
			Entrar em contato
			<ArrowRight
				size={20}
				class="transition-transform duration-300 group-hover:translate-x-1"
			/>
		</a>
	</div>
</div>
