<script lang="ts">
	import { Button, ScrollArea } from 'bits-ui';
	import { marked } from 'marked';
	// import teste from './teste.md';
	// import { chatHistory, addMessage } from '$lib/stores/chatStore';
	// import { useChat } from '@ai-sdk/svelte';
	// import type { Message } from 'ai';
	// import type { ActionData } from './$types';
	import CardProfile from '../../components/CardProfile.svelte';
	import CardPesquisa from '../../components/CardPesquisa.svelte';
	import { ChevronLeft } from '@lucide/svelte';

	let { data } = $props();
	let api = JSON.parse(data.api);

	const markdown = api.desc ? marked.parse(api.desc) : '';

	// const { messages } = useChat({
	// 	initialInput: text,
	// 	initialMessages: $chatHistory,
	// 	onFinish: (message: Message) => {
	// 		addMessage(message);
	// 	}
	// });

	// async function handleUserSubmit(event: Event) {
	// 	event.preventDefault();
	// 	if ($input.trim() === '') return;
	// 	addMessage({ id: crypto.randomUUID(), role: 'user', content: $input });
	// 	try {
	// 		handleSubmit(event);
	// 	} catch (err) {
	// 		console.error('Error sending message:', err);
	// 	}
	// }

	// $effect(() => console.log(api));
</script>

<div class="flex h-full w-full flex-col items-start justify-start gap-4 lg:h-svh">
	<Button.Root
		href="../"
		class="bg-principal-1 hover:bg-principal-4 mt-4 ml-4 inline-block rounded-full border-2 border-black shadow hover:border-black/80"
	>
		<ChevronLeft class="size-10 stroke-1 hover:stroke-black/80" />
	</Button.Root>

	<div class="flex h-1/3 w-full flex-1 flex-col justify-center gap-8 p-4 pt-0 lg:flex-row">
		<main
			class="border-principal-4 flex basis-1/2 flex-col justify-between gap-8 rounded-xl border-2 px-8 py-8 shadow-xl {markdown
				? 'h-full'
				: 'h-1/2'}"
		>
			<h1 class="text-center text-3xl font-bold">Resposta da IA</h1>
			<ScrollArea.Root class="overflow-hidden rounded-md bg-white/80 p-4 text-justify">
				<ScrollArea.Viewport class="h-full">
					{#if markdown}
						<div id="markdown">
							{@html marked.parse(markdown)}
						</div>
					{:else}
						<h2 class="text-principal-5 text-center text-2xl font-bold">
							Nenhuma Pesquisa Realizada
						</h2>
						<h3 class="text-principal-4 text-center text-xl font-bold">
							Faça uma pesquisa no botão embaixo!!
						</h3>
					{/if}
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					orientation="vertical"
					class="bg-principal-2 hover:bg-principal-6 my-1 hidden w-3 touch-none rounded-full border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3 lg:flex"
				>
					<ScrollArea.Thumb class="bg-principal-4 flex-1 rounded-full" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner />
			</ScrollArea.Root>
			<CardPesquisa />
		</main>
		{#if markdown}
			<CardProfile usuarios={api.usuarios}></CardProfile>
		{/if}
	</div>
</div>

<style>
	#markdown :global {
		code {
			/* color: color-mix(in oklab, var(--color-black) 90%, transparent); */
			font-weight: 500;
			background-color: var(--color-zinc-400);
			padding: 5px;
			border-radius: 15px;
		}

		/* Headings */
		h1 {
			font-size: 1.5rem;
			margin: 1.5rem 0;
		}

		h2 {
			font-size: 2rem;
			margin: 1.8rem 0 1.2rem;
			color: #444;
		}

		h3 {
			font-size: 1.75rem;
			margin: 1.5rem 0 1rem;
		}

		h4 {
			font-size: 1.5rem;
			margin: 1.2rem 0 0.8rem;
		}

		h5 {
			font-size: 1.25rem;
			margin: 1rem 0 0.6rem;
		}

		h6 {
			font-size: 1rem;
			margin: 0.8rem 0 0.5rem;
			color: #666;
		}

		/* Paragraphs */
		p {
			margin-bottom: 1.2rem;
			hyphens: auto;
		}

		/* Lists */
		ul,
		ol {
			margin: 1rem 0;
			padding-left: 2rem;
		}

		li {
			margin: 0.2rem 0;
			padding-left: 0.2rem;
			list-style-type: disc;
		}

		ul ul,
		ol ol {
			margin: 0.2rem 0;
		}

		li > p {
			margin: 0.2rem 0;
		}

		/* Code Blocks */
		pre {
			background: #f8f9fa;
			padding: 1.5rem;
			border-radius: 6px;
			overflow-x: auto;
			margin: 1.5rem 0;
			font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		}

		code {
			background: #f3f3f3;
			padding: 0.2em 0.4em;
			border-radius: 3px;
			font-size: 0.9em;
		}

		pre code {
			background: none;
			padding: 0;
			font-size: 0.9em;
		}

		/* Blockquotes */
		blockquote {
			border-left: 4px solid #ddd;
			margin: 1.5rem 0;
			padding: 0.5rem 1.5rem;
			color: #666;
			background-color: #f9f9f9;
		}

		blockquote p {
			margin: 0.5rem 0;
		}

		/* Tables */
		table {
			width: 100%;
			border-collapse: collapse;
			margin: 1.5rem 0;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}

		th,
		td {
			padding: 0.75rem;
			text-align: left;
			border-bottom: 1px solid #ddd;
		}

		th {
			background-color: #f8f9fa;
			font-weight: 600;
		}

		tr:hover {
			background-color: #f5f5f5;
		}

		/* Links */
		a {
			color: #0366d6;
			text-decoration: none;
			transition: color 0.2s ease;
		}

		a:hover {
			color: #033d7d;
			text-decoration: underline;
		}

		/* Images */
		img {
			max-width: 100%;
			height: auto;
			margin: 1.5rem 0;
			border-radius: 4px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}

		/* Horizontal Rules */
		hr {
			border: 0;
			height: 1px;
			background: #ddd;
			margin: 2rem 0;
		}

		/* Additional Enhancements */
		kbd {
			background: #fafbfc;
			border: 1px solid #d1d5da;
			border-radius: 3px;
			box-shadow: inset 0 -1px 0 #d1d5da;
			color: #444;
			display: inline-block;
			font-family: monospace;
			padding: 3px 5px;
		}

		.footnotes {
			font-size: 0.9em;
			color: #666;
			border-top: 1px solid #eee;
			margin-top: 2rem;
			padding-top: 1rem;
		}
	}
</style>
