<script lang="ts">
	import { Dialog, Meter, Label, RadioGroup } from 'bits-ui';
	import { X } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { fly } from 'svelte/transition';
	import Loading from './Loading.svelte';

	const { errors: signupErrors, enhance: signupEnhance } = superForm($page.data.formSignup);
	const {
		errors: loginErrors,
		enhance: loginEnhance,
		delayed: delayed
	} = superForm($page.data.formLogin, {
		delayMs: 0,
		timeoutMs: 0,
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				window.location.href = window.location.href;
			}
		}
	});

	let isClient = $state('Cliente');
	let dateToday = new Date().toISOString().split('T')[0].split('-');
	dateToday[0] = String(Number(dateToday[0]) - 18);
	// let placeholdCPF = $derived(isCPF === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00');

	let password = $state('');
	let strength = $derived(checkPasswordStrength() * 100);

	const colorName = $derived.by(() => {
		if (strength <= 20) return 'text-red-500 dark:text-red-400';
		if (strength <= 40) return 'text-orange-500 dark:text-orange-400';
		if (strength <= 60) return 'text-yellow-500 dark:text-yellow-400';
		return 'text-green-500 dark:text-green-400';
	});

	const colorMeter = $derived.by(() => {
		if (strength <= 20) return 'bg-red-500 dark:bg-red-400';
		if (strength <= 40) return 'bg-orange-500 dark:bg-orange-400';
		if (strength <= 60) return 'bg-yellow-500 dark:bg-yellow-400';
		return 'bg-green-500 dark:bg-green-400';
	});

	function stringPassword() {
		if (strength === 20) return 'senha fraca';
		if (strength === 40) return 'senha media';
		if (Math.floor(strength) === 60 || strength === 80) return 'senha forte';
		if (strength === 100) return 'senha muito forte';
		return '';
	}

	function checkPasswordStrength(): number {
		let sum: number = 0;
		sum += password.length >= 8 ? 0.2 : 0;
		sum += /[A-Z]/.test(password) ? 0.2 : 0;
		sum += /[a-z]/.test(password) ? 0.2 : 0;
		sum += /[0-9]/.test(password) ? 0.2 : 0;
		sum += /[^A-Za-z0-9]/.test(password) ? 0.2 : 0;
		if (password.length >= 15) return 1;
		return sum;
	}
</script>

{#snippet login()}
	<form method="POST" action="?/login" use:loginEnhance>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="email" class="text-sm font-medium">Email:</Label.Root>
			<div class="w-full">
				<input
					type="email"
					name="email"
					aria-invalid={$loginErrors.email ? 'true' : undefined}
					class="bg-principal-1 line inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
			{#if $loginErrors.email}<span class="mt-1 pl-2 font-bold text-red-500"
					>{$loginErrors.email}</span
				>{/if}
		</div>
		<div class="mb-8 flex flex-col items-start gap-1 py-4">
			<Label.Root for="password" class="text-sm font-medium">Senha:</Label.Root>
			<div class="w-full">
				<input
					type="password"
					name="password"
					aria-invalid={$loginErrors.password ? 'true' : undefined}
					class="bg-principal-1 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
			{#if $loginErrors.password}<span class="mt-1 pl-2 font-bold text-red-500"
					>{$loginErrors.password}</span
				>{/if}
		</div>
		<div class="flex w-full flex-col items-center gap-2">
			<button
				class="bg-principal-5 hover:bg-principal-3 mb-4 inline-flex h-10 w-2/3 items-center justify-center rounded-lg px-12 py-6 font-semibold text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
			>
				{#if $delayed}
					<Loading />
				{:else}
					Entrar
				{/if}
			</button>
			{#if $loginErrors._errors && !($loginErrors.password || $loginErrors.email)}
				<span class="font-bold text-red-500" in:fly={{ x: 200, duration: 1000 }}>
					{$loginErrors._errors}
				</span>
			{/if}
		</div>
	</form>
{/snippet}

{#snippet cadastro()}
	<form method="POST" action="?/signup" use:signupEnhance>
		<div class="flex flex-col items-center gap-2 py-4">
			<Label.Root for="client" class="w-1/2 text-sm font-medium text-black"
				><RadioGroup.Root
					name="radio"
					bind:value={isClient}
					class="flex flex-1 flex-wrap justify-between gap-4 text-sm font-medium"
				>
					{#each ['Cliente', 'Prestador'] as itens (itens)}
						<div class="flex items-center gap-4">
							<RadioGroup.Item
								id={itens}
								value={itens}
								class="data-[state=checked]:border-principal-3 size-6 shrink-0 cursor-default rounded-full border-2 border-black transition-all duration-100 ease-in-out hover:border-black/40 data-[state=checked]:border-6"
							></RadioGroup.Item><Label.Root for={itens} class="">{itens}</Label.Root>
						</div>
					{/each}
				</RadioGroup.Root></Label.Root
			>
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="name" class="text-sm font-medium">Nome Completo:</Label.Root>
			<div class="w-full">
				<input
					type="text"
					name="name"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
			{#if $signupErrors.name}<span class="mt-1 pl-2 text-sm font-bold text-red-500"
					>{$signupErrors.name}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="date" class="text-sm font-medium"
				>Data de nascimento / abertura da empresa:</Label.Root
			>
			<div class="w-full">
				<input
					type="date"
					max={isClient === 'Cliente'
						? dateToday.join('-')
						: new Date().toISOString().split('T')[0]}
					name="date"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
			{#if $signupErrors.date}<span class="mt-1 pl-2 text-sm font-bold text-red-500"
					>{$signupErrors.date}</span
				>{/if}
		</div>

		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="typePersonal" class="text-sm font-medium">CPF / CNPJ:</Label.Root>
			<div class="w-full">
				<input
					type="text"
					placeholder="0000000000"
					name="typePersonal"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>

			{#if $signupErrors.typePersonal}<span class="mt-1 pl-2 text-sm font-bold text-red-500"
					>{$signupErrors.typePersonal}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="phone" class="text-sm font-medium">Telefone:</Label.Root>
			<div class="w-full">
				<input
					type="text"
					name="phone"
					placeholder="(00)00000-0000"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>

			{#if $signupErrors.phone}<span class="mt-1 pl-2 text-sm font-bold text-red-500"
					>{$signupErrors.phone}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="email" class="text-sm font-medium">Email:</Label.Root>
			<div class="w-full">
				<input
					type="email"
					name="email"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>

			{#if $signupErrors.email}<span class="mt-1 pl-2 text-sm font-bold text-red-500"
					>{$signupErrors.email}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="password" class="text-sm font-medium">Senha:</Label.Root>
			<div class="flex w-full flex-col gap-4">
				<input
					bind:value={password}
					type="password"
					name="password"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
				{#if $signupErrors.password}<span class="mt-1 pl-2 text-sm font-bold text-red-500"
						>{$signupErrors.password}</span
					>{/if}
				<div class="flex w-[60%] flex-col">
					<Meter.Root
						aria-valuetext="password strength {strength}% - {stringPassword()}"
						value={strength}
						min={0}
						max={100}
						class="bg-dark-10 shadow-mini-inset relative h-[15px] overflow-hidden rounded-full"
					>
						<div
							class="shadow-mini-inset h-full w-full flex-1 rounded-full transition-all duration-1000 ease-in-out {colorMeter}"
							style="transform: translateX(-{100 - (100 * (strength ?? 0)) / 100}%)"
						></div>
					</Meter.Root>
					<span class="font-bold transition-all duration-1000 ease-in-out {colorName}"
						>{stringPassword()}</span
					>
				</div>
			</div>
		</div>
		<div class="flex w-full justify-center">
			<button
				class="bg-principal-5 hover:bg-principal-3 inline-flex h-10 items-center justify-center rounded-lg px-12 font-semibold text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
			>
				Cadastrar
			</button>
		</div>
	</form>
{/snippet}

<Dialog.Root>
	<Dialog.Trigger
		class="bg-principal-5 hover:bg-principal-3 inline-flex h-12 items-center justify-center rounded-lg px-[21px] text-[15px] font-semibold whitespace-nowrap text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
	>
		Login
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			class="bg-principal-1 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border p-5 shadow-sm outline-hidden sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-2xl font-bold tracking-tight "
			>
				Login
			</Dialog.Title>
			{@render login()}
			<Dialog.Close
				class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
			>
				<X class="hover:text-principal-4 size-6 text-black" />
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<Dialog.Root>
	<Dialog.Trigger
		class="bg-principal-5 hover:bg-principal-3 inline-flex h-12 items-center justify-center rounded-lg px-[21px] text-[15px] font-semibold whitespace-nowrap text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
	>
		Cadastro
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			class="bg-principal-1 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border p-5 shadow-sm outline-hidden sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-2xl font-bold tracking-tight "
			>
				Cadastro
			</Dialog.Title>
			{@render cadastro()}
			<Dialog.Close
				class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
			>
				<X class="hover:text-principal-4 size-6 text-black" />
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
