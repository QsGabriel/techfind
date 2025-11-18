<script lang="ts">
	import logo from '$lib/images/logolaran.svg';
	import { slide } from 'svelte/transition';
	import Dialog from './Dialog.svelte';
	import { AlignJustify } from '@lucide/svelte';
	import { Collapsible } from 'bits-ui';
	import { onMount } from 'svelte';

	let size = $state(0);
	let isOpen = $state(false);
	let isMenu = $derived(size >= 1216 ? true : false);
	let activeSection = $state('início');

	const list = [
		{ name: 'início', href: '/', id: '' },
		{ name: 'Vantagens', href: '/#vantagens', id: 'vantagens' },
		{ name: 'Sobre nós', href: '/#aboutus', id: 'aboutus' },
		{ name: 'Planos', href: '/#planos', id: 'planos' },
		{ name: 'Suporte', href: '/#support', id: 'support' }
	];

	$effect(() => {
		if (size >= 1216 && isOpen) {
			isOpen = !isOpen;
		}
	});

	onMount(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 150;

			// Se estiver no topo da página
			if (window.scrollY < 100) {
				activeSection = 'início';
				return;
			}

			// Verifica qual seção está visível
			for (const item of list) {
				if (item.id) {
					const element = document.getElementById(item.id);
					if (element) {
						const rect = element.getBoundingClientRect();
						const elementTop = window.scrollY + rect.top;
						const elementBottom = elementTop + element.offsetHeight;

						if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
							activeSection = item.name;
							return;
						}
					}
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Chama imediatamente para definir a seção inicial

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#snippet Modal()}
	<nav class="relative flex items-center justify-between gap-4">
		<img src={logo} alt="logo techfind" class="h-12 object-cover" />
		<ul class="flex list-none gap-4">
			{#each list as item}
				<li class="relative transition-colors duration-150">
					<a
						href={item.href}
						class="font-semibold no-underline {activeSection === item.name
							? 'text-principal-4'
							: 'hover:text-principal-4'}"
					>
						{item.name}
					</a>
					{#if activeSection === item.name}
						<div
							class="bg-principal-4 absolute -bottom-1 left-0 h-0.5 w-full rounded-full"
							transition:slide={{ axis: 'x', duration: 200 }}
						></div>
					{/if}
				</li>
			{/each}
		</ul>
		<div class="flex gap-4">
			<Dialog />
		</div>
	</nav>
{/snippet}

{#snippet ModalMobile()}
	<Collapsible.Root class="w-full">
		<nav class="relative flex min-h-12 flex-col justify-center gap-8">
			<div class="flex w-full justify-between">
				<img src={logo} alt="logo techfind" class="h-8 object-cover" />
				<Collapsible.Trigger><AlignJustify /></Collapsible.Trigger>
			</div>
			<Collapsible.Content forceMount class="w-full">
				{#snippet child({ props, open })}
					{#if open}
						<div
							{...props}
							class="flex flex-wrap items-center justify-between gap-8"
							transition:slide={{ axis: 'y' }}
						>
							<ul class="flex w-full list-none flex-wrap justify-center gap-4 md:w-auto">
								{#each list as item}
									<li class="relative transition-colors duration-150">
										<a
											href={item.href}
											class="font-semibold no-underline {activeSection === item.name
												? 'text-principal-4'
												: 'hover:text-principal-4'}"
										>
											{item.name}
										</a>
										{#if activeSection === item.name}
											<div
												class="bg-principal-4 absolute -bottom-1 left-0 h-0.5 w-full rounded-full"
												transition:slide={{ axis: 'x', duration: 200 }}
											></div>
										{/if}
									</li>
								{/each}
							</ul>
							<div class="flex w-full flex-wrap justify-center gap-4 md:w-auto">
								<Dialog />
							</div>
						</div>
					{/if}
				{/snippet}
			</Collapsible.Content>
		</nav>
	</Collapsible.Root>
{/snippet}

<header bind:clientWidth={size} class="bg-principal-1 sticky top-0 z-10 p-6 shadow-md">
	{#if isMenu}
		{@render Modal()}
	{:else}
		{@render ModalMobile()}
	{/if}
</header>
