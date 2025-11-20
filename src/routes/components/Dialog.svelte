<script lang="ts">
	import { Dialog, Meter, Label, RadioGroup } from 'bits-ui';
	import { X, Eye, EyeOff, CheckCircle2, AlertCircle } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { fly, scale } from 'svelte/transition';
	import Loading from './Loading.svelte';

	const {
		errors: signupErrors,
		enhance: signupEnhance,
		delayed: delayedSignup
	} = superForm($page.data.formSignup, {
		delayMs: 0,
		timeoutMs: 0,
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				window.location.href = window.location.href;
			}
		}
	});
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

	// Reset password form
	const {
		errors: resetErrors,
		enhance: resetEnhance,
		delayed: delayedReset,
		message: resetMessage
	} = superForm($page.data.formResetPassword, {
		delayMs: 0,
		timeoutMs: 0,
		resetForm: true
	});

	let isClient = $state('Cliente');
	let showLoginPassword = $state(false);
	let showSignupPassword = $state(false);
	let showForgotPassword = $state(false);
	let resetSuccess = $state(false);
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

	// Input masks
	function maskPhone(value: string) {
		return value
			.replace(/\D/g, '')
			.replace(/^(\d{2})(\d)/g, '($1) $2')
			.replace(/(\d)(\d{4})$/, '$1-$2')
			.slice(0, 15);
	}

	function maskCPFCNPJ(value: string) {
		const numbers = value.replace(/\D/g, '');
		if (numbers.length <= 11) {
			return numbers
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
		}
		return numbers
			.replace(/(\d{2})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1/$2')
			.replace(/(\d{4})(\d{1,2})$/, '$1-$2')
			.slice(0, 18);
	}

	function handlePhoneInput(e: Event) {
		const input = e.target as HTMLInputElement;
		input.value = maskPhone(input.value);
	}

	function handleCPFCNPJInput(e: Event) {
		const input = e.target as HTMLInputElement;
		input.value = maskCPFCNPJ(input.value);
	}

	$effect(() => {
		if ($resetMessage?.success) {
			resetSuccess = true;
			setTimeout(() => {
				showForgotPassword = false;
				resetSuccess = false;
			}, 3000);
		}
	});
</script>

{#snippet login()}
	{#if !showForgotPassword}
		<form method="POST" action="?/login" use:loginEnhance>
			<div class="flex flex-col items-start gap-2 py-3">
				<Label.Root for="email-login" class="text-sm font-medium text-gray-700 dark:text-gray-200">
					Email
				</Label.Root>
				<div class="w-full">
					<input
						id="email-login"
						type="email"
						name="email"
						placeholder="seu@email.com"
						aria-invalid={$loginErrors.email ? 'true' : undefined}
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
					/>
				</div>
				{#if $loginErrors.email}
					<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
						<AlertCircle class="size-4" />
						{$loginErrors.email}
					</span>
				{/if}
			</div>
			
			<div class="flex flex-col items-start gap-2 py-3">
				<Label.Root for="password-login" class="text-sm font-medium text-gray-700 dark:text-gray-200">
					Senha
				</Label.Root>
				<div class="relative w-full">
					<input
						id="password-login"
						type={showLoginPassword ? 'text' : 'password'}
						name="password"
						placeholder="••••••••"
						aria-invalid={$loginErrors.password ? 'true' : undefined}
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
					/>
					<button
						type="button"
						onclick={() => (showLoginPassword = !showLoginPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
					>
						{#if showLoginPassword}
							<EyeOff class="size-5" />
						{:else}
							<Eye class="size-5" />
						{/if}
					</button>
				</div>
				{#if $loginErrors.password}
					<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
						<AlertCircle class="size-4" />
						{$loginErrors.password}
					</span>
				{/if}
			</div>

			<div class="flex justify-end py-2">
				<button
					type="button"
					onclick={() => (showForgotPassword = true)}
					class="text-sm font-medium text-principal-6 hover:text-principal-5 transition-colors"
				>
					Esqueceu sua senha?
				</button>
			</div>
			
			<div class="flex flex-col items-center gap-3 pt-4">
				<button
					type="submit"
					class="w-full bg-principal-5 hover:bg-principal-6 rounded-lg px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={$delayed}
				>
					{#if $delayed}
						<Loading />
					{:else}
						Entrar
					{/if}
				</button>
				
				{#if $loginErrors._errors && !($loginErrors.password || $loginErrors.email)}
					<div class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg w-full" transition:scale>
						<AlertCircle class="size-5 text-red-500" />
						<span class="text-sm font-medium text-red-700 dark:text-red-300">
							{$loginErrors._errors}
						</span>
					</div>
				{/if}
			</div>
		</form>
	{:else}
		<!-- Forgot Password Form -->
		<div class="space-y-4" transition:fly={{ x: 200, duration: 300 }}>
			{#if resetSuccess}
				<div class="flex flex-col items-center justify-center py-8 gap-4" transition:scale>
					<CheckCircle2 class="size-16 text-green-500" />
					<h3 class="text-xl font-bold text-gray-900 dark:text-white">Email Enviado!</h3>
					<p class="text-center text-gray-600 dark:text-gray-400">
						Verifique sua caixa de entrada para redefinir sua senha.
					</p>
				</div>
			{:else}
				<div class="space-y-2">
					<button
						type="button"
						onclick={() => (showForgotPassword = false)}
						class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						← Voltar ao login
					</button>
					<h3 class="text-xl font-bold text-gray-900 dark:text-white">Recuperar Senha</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Digite seu email e enviaremos um link para redefinir sua senha.
					</p>
				</div>

				<form method="POST" action="?/resetPassword" use:resetEnhance>
					<div class="flex flex-col items-start gap-2 py-3">
						<Label.Root for="email-reset" class="text-sm font-medium text-gray-700 dark:text-gray-200">
							Email
						</Label.Root>
						<div class="w-full">
							<input
								id="email-reset"
								type="email"
								name="email"
								placeholder="seu@email.com"
								aria-invalid={$resetErrors.email ? 'true' : undefined}
								class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
							/>
						</div>
						{#if $resetErrors.email}
							<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
								<AlertCircle class="size-4" />
								{$resetErrors.email}
							</span>
						{/if}
					</div>

					<button
						type="submit"
						class="w-full bg-principal-5 hover:bg-principal-6 rounded-lg px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
						disabled={$delayedReset}
					>
						{#if $delayedReset}
							<Loading />
						{:else}
							Enviar Link de Recuperação
						{/if}
					</button>

					{#if $resetErrors._errors}
						<div class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg w-full mt-4" transition:scale>
							<AlertCircle class="size-5 text-red-500" />
							<span class="text-sm font-medium text-red-700 dark:text-red-300">
								{$resetErrors._errors}
							</span>
						</div>
					{/if}
				</form>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet cadastro()}
	<form method="POST" action="?/signup" use:signupEnhance>
		<div class="flex flex-col items-start gap-3 py-4">
			<Label.Root for="client" class="text-sm font-medium text-gray-900 dark:text-white">Tipo de conta:</Label.Root>
			<RadioGroup.Root
				name="radio"
				bind:value={isClient}
				class="flex w-full items-center gap-3"
			>
			{#each ['Cliente', 'Prestador'] as itens (itens)}
				<label 
					for={itens}
					class="relative flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 transition-all cursor-pointer flex-1 overflow-hidden
						{isClient === itens 
							? 'border-principal-5 bg-principal-5/5 dark:bg-principal-5/10 shadow-lg' 
							: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-principal-4 hover:bg-gray-50 dark:hover:bg-gray-700/50'}"
				>
					{#if isClient === itens}
						<div class="absolute inset-0 rounded-xl">
							<div class="absolute inset-0 rounded-xl border-glow"></div>
						</div>
					{/if}
					<RadioGroup.Item
						id={itens}
						value={itens}
						class="relative h-5 w-5 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center z-10
							{isClient === itens 
								? 'border-principal-5 bg-principal-5' 
								: 'border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800'}"
					>
						<div 
							class="h-2.5 w-2.5 rounded-full bg-white transition-transform duration-200
								{isClient === itens ? 'scale-100' : 'scale-0'}"
						></div>
					</RadioGroup.Item>
					<span class="text-sm font-semibold relative z-10 transition-colors
						{isClient === itens 
							? 'text-principal-6 dark:text-principal-4' 
							: 'text-gray-700 dark:text-gray-300'}"
					>
						{itens}
					</span>
				</label>
			{/each}
			</RadioGroup.Root>
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="name" class="text-sm font-medium">Nome Completo:</Label.Root>
			<div class="w-full">
				<input
					id="name"
					type="text"
					name="name"
					placeholder="Seu nome completo"
					class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
				/>
			</div>
			{#if $signupErrors.name}<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
					<AlertCircle class="size-4" />
					{$signupErrors.name}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="date" class="text-sm font-medium">
				{isClient === 'Cliente' ? 'Data de Nascimento' : 'Data de Abertura da Empresa'}
			</Label.Root>
			<div class="w-full">
				<input
					id="date"
					type="date"
					max={isClient === 'Cliente'
						? dateToday.join('-')
						: new Date().toISOString().split('T')[0]}
					name="date"
					class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
				/>
			</div>
			{#if $signupErrors.date}<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
					<AlertCircle class="size-4" />
					{$signupErrors.date}</span
				>{/if}
		</div>

		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="typePersonal" class="text-sm font-medium">CPF / CNPJ:</Label.Root>
			<div class="w-full">
				<input
					id="typePersonal"
					type="text"
					placeholder={isClient === 'Cliente' ? '000.000.000-00' : '00.000.000/0000-00'}
					name="typePersonal"
					oninput={handleCPFCNPJInput}
					class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
				/>
			</div>

			{#if $signupErrors.typePersonal}<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
					<AlertCircle class="size-4" />
					{$signupErrors.typePersonal}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="phone" class="text-sm font-medium">Telefone:</Label.Root>
			<div class="w-full">
				<input
					id="phone"
					type="text"
					name="phone"
					placeholder="(11) 99999-9999"
					oninput={handlePhoneInput}
					class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
				/>
			</div>

			{#if $signupErrors.phone}<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
					<AlertCircle class="size-4" />
					{$signupErrors.phone}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="email" class="text-sm font-medium">Email:</Label.Root>
			<div class="w-full">
				<input
					id="email"
					type="email"
					name="email"
					placeholder="seu@email.com"
					class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
				/>
			</div>

			{#if $signupErrors.email}<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
					<AlertCircle class="size-4" />
					{$signupErrors.email}</span
				>{/if}
		</div>
		<div class="flex flex-col items-start gap-1 py-4">
			<Label.Root for="password" class="text-sm font-medium">Senha:</Label.Root>
			<div class="flex w-full flex-col gap-4">
				<div class="relative w-full">
					<input
						id="password-signup"
						bind:value={password}
						type={showSignupPassword ? 'text' : 'password'}
						name="password"
						placeholder="••••••••"
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
					/>
					<button
						type="button"
						onclick={() => (showSignupPassword = !showSignupPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
					>
						{#if showSignupPassword}
							<EyeOff class="size-5" />
						{:else}
							<Eye class="size-5" />
						{/if}
					</button>
				</div>
				{#if $signupErrors.password}<span class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
						<AlertCircle class="size-4" />
						{$signupErrors.password}</span
					>{/if}
					
				{#if password.length > 0}
					<div class="space-y-2 pt-2" transition:fly={{ y: -10 }}>
						<Meter.Root
							aria-valuetext="password strength {strength}% - {stringPassword()}"
							value={strength}
							min={0}
							max={100}
							class="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
						>
							<div
								class="h-full rounded-full transition-all duration-500 ease-out {colorMeter}"
								style="width: {strength}%"
							></div>
						</Meter.Root>
						<span class="text-sm font-medium transition-all duration-500 {colorName}">
							{stringPassword()}
						</span>
					</div>
				{/if}
			</div>
		</div>
		<div class="flex flex-col items-center gap-3 pt-2">
			<button
				type="submit"
				class="w-full bg-principal-5 hover:bg-principal-6 rounded-lg px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={$delayedSignup}
			>
				{#if $delayedSignup}
					<Loading />
				{:else}
					Criar Conta
				{/if}
			</button>
			
			{#if $signupErrors._errors}
				<div class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg w-full" transition:scale>
					<AlertCircle class="size-5 text-red-500" />
					<span class="text-sm font-medium text-red-700 dark:text-red-300">
						{$signupErrors._errors}
					</span>
				</div>
			{/if}
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
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
		<Dialog.Content
			class="bg-white dark:bg-gray-900 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl outline-hidden sm:max-w-[490px] md:w-full"
		>
			<div class="flex items-center justify-center border-b border-gray-200 dark:border-gray-700 p-6">
				<Dialog.Title class="text-2xl font-bold text-gray-900 dark:text-white">
					{showForgotPassword ? 'Recuperar Senha' : 'Bem-vindo de volta!'}
				</Dialog.Title>
				<Dialog.Close
					class="absolute top-5 right-5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-principal-5 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.95]"
				>
					<X class="size-6" />
				</Dialog.Close>
			</div>
			<div class="overflow-y-auto p-6">
				{@render login()}
			</div>
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
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
		<Dialog.Content
			class="bg-white dark:bg-gray-900 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl outline-hidden sm:max-w-[490px] md:w-full"
		>
			<div class="flex items-center justify-center border-b border-gray-200 dark:border-gray-700 p-6">
				<Dialog.Title class="text-2xl font-bold text-gray-900 dark:text-white">
					Criar Conta
				</Dialog.Title>
				<Dialog.Close
					class="absolute top-5 right-5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-principal-5 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.95]"
				>
					<X class="size-6" />
				</Dialog.Close>
			</div>
			<div class="overflow-y-auto p-6">
				{@render cadastro()}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	@keyframes border-glow {
		0% {
			box-shadow: 
				0 0 0 0 rgba(var(--principal-5-rgb, 99, 102, 241), 0.4),
				0 0 8px 2px rgba(var(--principal-5-rgb, 99, 102, 241), 0.2);
		}
		50% {
			box-shadow: 
				0 0 0 3px rgba(var(--principal-5-rgb, 99, 102, 241), 0.2),
				0 0 15px 4px rgba(var(--principal-5-rgb, 99, 102, 241), 0.4);
		}
		100% {
			box-shadow: 
				0 0 0 0 rgba(var(--principal-5-rgb, 99, 102, 241), 0.4),
				0 0 8px 2px rgba(var(--principal-5-rgb, 99, 102, 241), 0.2);
		}
	}

	.border-glow {
		animation: border-glow 2s ease-in-out infinite;
		border-radius: inherit;
	}
</style>
