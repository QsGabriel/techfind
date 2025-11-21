<script lang="ts">
	import logo from '$lib/images/logolaran.svg';
	import { slide } from 'svelte/transition';
	import { AlignJustify, LogOut, User } from '@lucide/svelte';
	import { Collapsible, Button } from 'bits-ui';
	import { goto } from '$app/navigation';
	import Loading from '../components/Loading.svelte';

	let { data, children } = $props();
	let { supabase, session } = $derived(data);

	let size = $state(0);
	let isOpen = $state(false);
	let isMenu = $derived(size >= 1216 ? true : false);

	let loading = $state(false);

	const list: Array<{ href: string; name: string }> = [];

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
		<a href="/pv" class="flex items-center gap-3 transition-opacity hover:opacity-80">
			<img src={logo} alt="logo techfind" class="h-12 object-cover" />
		</a>
		<ul class="flex list-none gap-4">
			{#each list as item}
				<li class="hover:text-principal-5 transition-colors duration-150">
					<a href={item.href} class="font-semibold no-underline">{item.name}</a>
				</li>
			{/each}
		</ul>
		<div class="flex gap-3">
			<Button.Root
				onclick={logout}
				class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-principal-5 to-principal-6 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
			>
				{#if loading}
					<Loading />
				{:else}
					<LogOut class="h-4 w-4" />
					Sair
				{/if}
			</Button.Root>
		</div>
	</nav>
{/snippet}

{#snippet ModalMobile()}
	<Collapsible.Root class="w-full">
		<nav class="relative flex min-h-12 flex-col justify-center gap-8">
			<div class="flex w-full justify-between items-center">
				<a href="/pv" class="flex items-center">
					<img src={logo} alt="logo techfind" class="h-8 object-cover" />
				</a>
				<Collapsible.Trigger class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
					<AlignJustify class="h-6 w-6" />
				</Collapsible.Trigger>
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
									<li class="hover:text-principal-5 transition-colors duration-150">
										<a href={item.href} class="font-semibold no-underline">{item.name}</a>
									</li>
								{/each}
							</ul>
							<div class="flex w-full flex-wrap justify-center gap-4 md:w-auto">
								<Button.Root
									onclick={logout}
									class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-principal-5 to-principal-6 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
								>
									{#if loading}
										<Loading />
									{:else}
										<LogOut class="h-4 w-4" />
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

<header bind:clientWidth={size} class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
	<div class="mx-auto max-w-7xl px-6 py-4">
		{#if isMenu}
			{@render Modal()}
		{:else}
			{@render ModalMobile()}
		{/if}
	</div>
</header>
{@render children()}
