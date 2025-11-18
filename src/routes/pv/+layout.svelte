<script lang="ts">
	import logo from '$lib/images/logolaran.svg';
	import { slide } from 'svelte/transition';
	import { AlignJustify } from '@lucide/svelte';
	import { Collapsible, Button } from 'bits-ui';
	import { goto } from '$app/navigation';
	import Loading from '../components/Loading.svelte';

	let { data, children } = $props();
	let { supabase, session } = $derived(data);

	let size = $state(0);
	let isOpen = $state(false);
	let isMenu = $derived(size >= 1216 ? true : false);

	let loading = $state(false);

	const list = [{}];

	$effect(() => {
		if (size >= 1216 && isOpen) {
			isOpen = !isOpen;
		}
	});

	const logout = async () => {
		loading = true;
		if (session) {
			const { error } = await supabase.auth.signOut();
			if (error) console.log(error);
			loading = false;
			goto('/');
		}
	};
</script>

{#snippet Modal()}
	<nav class="relative flex items-center justify-between gap-4">
		<img src={logo} alt="logo techfind" class="h-12 object-cover" />
		<ul class="flex list-none gap-4">
			{#each list as item}
				<li class="hover:text-principal-4 transition-colors duration-150">
					<a href={item.href} class="font-semibold no-underline">{item.name}</a>
				</li>
			{/each}
		</ul>
		<div class="flex gap-4">
			<Button.Root
				onclick={logout}
				class="bg-principal-4 hover:bg-principal-3 rounded-lg px-4 py-2 text-xl font-medium shadow-md transition-colors duration-300"
			>
				{#if loading}
					<Loading />
				{:else}
					Sair
				{/if}
			</Button.Root>
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
									<li class="hover:text-principal-4 transition-colors duration-150">
										<a href={item.href} class="font-semibold no-underline">{item.name}</a>
									</li>
								{/each}
							</ul>
							<div class="flex w-full flex-wrap justify-center gap-4 md:w-auto">
								<Button.Root
									onclick={logout}
									class="bg-principal-4 hover:bg-principal-3 rounded-lg px-4 py-2 text-xl font-medium shadow-md transition-colors duration-300"
								>
									{#if loading}
										<Loading />
									{:else}
										Sair
									{/if}
								</Button.Root>
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
{@render children()}
