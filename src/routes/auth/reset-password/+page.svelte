<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Eye, EyeOff, AlertCircle, CheckCircle2 } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	
	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		resetForm: false,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				setTimeout(() => {
					goto('/');
				}, 2000);
			}
		}
	});

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let passwordStrength = $state(0);
	let passwordMatch = $derived($form.password === $form.confirmPassword && $form.confirmPassword.length > 0);

	// Calcular força da senha
	$effect(() => {
		const password = $form.password;
		let strength = 0;
		
		if (password.length >= 8) strength += 25;
		if (password.length >= 12) strength += 25;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
		if (/[0-9]/.test(password)) strength += 12.5;
		if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
		
		passwordStrength = Math.min(strength, 100);
	});

	const strengthColor = $derived(
		passwordStrength < 30 ? 'bg-red-500' :
		passwordStrength < 60 ? 'bg-yellow-500' :
		passwordStrength < 80 ? 'bg-blue-500' :
		'bg-green-500'
	);

	const strengthText = $derived(
		passwordStrength < 30 ? 'Fraca' :
		passwordStrength < 60 ? 'Média' :
		passwordStrength < 80 ? 'Boa' :
		'Forte'
	);
</script>

<svelte:head>
	<title>Redefinir Senha - Techfind</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-principal-1 via-principal-2 to-principal-3 px-4 py-12">
	<div class="w-full max-w-md">
		<div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
			<!-- Header -->
			<div class="text-center mb-8">
				<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-principal-5/10 mb-4">
					<svg class="w-8 h-8 text-principal-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Redefinir Senha
				</h1>
				<p class="text-gray-600 dark:text-gray-400">
					Crie uma nova senha segura para sua conta
				</p>
			</div>

			{#if $message}
				<div class="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-3" transition:fly={{ y: -10 }}>
					<CheckCircle2 class="size-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
					<div>
						<p class="text-sm font-medium text-green-800 dark:text-green-200">
							Senha redefinida com sucesso!
						</p>
						<p class="text-xs text-green-700 dark:text-green-300 mt-1">
							Redirecionando para a página inicial...
						</p>
					</div>
				</div>
			{:else}
				<form method="POST" action="?/updatePassword" use:enhance class="space-y-6">
					<!-- Nova Senha -->
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
							Nova Senha
						</label>
						<div class="relative">
							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								name="password"
								bind:value={$form.password}
								placeholder="••••••••"
								class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pr-10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
								required
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
							>
								{#if showPassword}
									<EyeOff class="size-5" />
								{:else}
									<Eye class="size-5" />
								{/if}
							</button>
						</div>
						{#if $errors.password}
							<p class="flex items-center gap-1 text-sm font-medium text-red-500 mt-2" transition:fly={{ y: -10 }}>
								<AlertCircle class="size-4" />
								{$errors.password}
							</p>
						{/if}

						{#if $form.password.length > 0}
							<div class="mt-3 space-y-2" transition:fly={{ y: -10 }}>
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-600 dark:text-gray-400">Força da senha:</span>
									<span class="font-medium {strengthColor.replace('bg-', 'text-')}">{strengthText}</span>
								</div>
								<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div
										class="{strengthColor} h-full rounded-full transition-all duration-500"
										style="width: {passwordStrength}%"
									></div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Confirmar Senha -->
					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
							Confirmar Nova Senha
						</label>
						<div class="relative">
							<input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								name="confirmPassword"
								bind:value={$form.confirmPassword}
								placeholder="••••••••"
								class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pr-10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-principal-5 focus:ring-2 focus:ring-principal-5/20 focus:outline-none transition-colors"
								required
							/>
							<button
								type="button"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
							>
								{#if showConfirmPassword}
									<EyeOff class="size-5" />
								{:else}
									<Eye class="size-5" />
								{/if}
							</button>
						</div>
						{#if $errors.confirmPassword}
							<p class="flex items-center gap-1 text-sm font-medium text-red-500 mt-2" transition:fly={{ y: -10 }}>
								<AlertCircle class="size-4" />
								{$errors.confirmPassword}
							</p>
						{/if}

						{#if $form.confirmPassword.length > 0}
							<div class="mt-2">
								{#if passwordMatch}
									<p class="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400" transition:fly={{ y: -10 }}>
										<CheckCircle2 class="size-4" />
										As senhas coincidem
									</p>
								{:else}
									<p class="flex items-center gap-1 text-sm font-medium text-red-500" transition:fly={{ y: -10 }}>
										<AlertCircle class="size-4" />
										As senhas não coincidem
									</p>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Botão Submit -->
					<button
						type="submit"
						disabled={$delayed || !passwordMatch || passwordStrength < 30}
						class="w-full bg-principal-5 hover:bg-principal-6 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
					>
						{#if $delayed}
							<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Processando...
						{:else}
							Redefinir Senha
						{/if}
					</button>

					{#if $errors._errors}
						<div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3" transition:fly={{ y: -10 }}>
							<AlertCircle class="size-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
							<p class="text-sm font-medium text-red-800 dark:text-red-200">
								{$errors._errors}
							</p>
						</div>
					{/if}
				</form>

				<!-- Link para voltar ao login -->
				<div class="mt-6 text-center">
					<a
						href="/"
						class="text-sm font-medium text-principal-6 hover:text-principal-5 transition-colors"
					>
						← Voltar para a página inicial
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
