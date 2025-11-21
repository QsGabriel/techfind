<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, enhance, errors, message } = superForm(data.formSetup, {
		resetForm: false,
		delayMs: 500,
		timeoutMs: 8000
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
	<div class="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
		<div class="mb-6 text-center">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Complete seu Perfil</h1>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Para continuar, precisamos de algumas informações
			</p>
			<p class="mt-2 text-xs text-gray-500 dark:text-gray-500">
				Email: {data.email}
			</p>
		</div>

		{#if $message}
			<div class="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
				<p class="text-sm text-red-800 dark:text-red-300">{$message}</p>
			</div>
		{/if}

		<form method="POST" action="?/createProfile" use:enhance class="space-y-4">
			<!-- Nome -->
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Nome Completo
				</label>
				<input
					type="text"
					id="name"
					name="name"
					bind:value={$form.name}
					class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-principal-5 focus:outline-none focus:ring-1 focus:ring-principal-5"
					required
				/>
				{#if $errors.name}
					<p class="mt-1 text-xs text-red-600 dark:text-red-400">{$errors.name}</p>
				{/if}
			</div>

			<!-- Tipo de Usuário -->
			<div>
				<fieldset>
					<legend class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Você é:
					</legend>
					<div class="space-y-2">
					<label class="flex items-center">
						<input
							type="radio"
							name="radio"
							value="Cliente"
							bind:group={$form.radio}
							class="h-4 w-4 border-gray-300 text-principal-5 focus:ring-principal-5"
							required
						/>
						<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Cliente</span>
					</label>
					<label class="flex items-center">
						<input
							type="radio"
							name="radio"
							value="Prestador"
							bind:group={$form.radio}
							class="h-4 w-4 border-gray-300 text-principal-5 focus:ring-principal-5"
						/>
					<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Prestador de Serviço</span>
				</label>
			</div>
			{#if $errors.radio}
				<p class="mt-1 text-xs text-red-600 dark:text-red-400">{$errors.radio}</p>
			{/if}
		</fieldset>
			</div>			<!-- CPF/CNPJ -->
			<div>
				<label for="typepersonal" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					CPF ou CNPJ (apenas números)
				</label>
				<input
					type="text"
					id="typepersonal"
					name="typepersonal"
					placeholder="00000000000"
					class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-principal-5 focus:outline-none focus:ring-1 focus:ring-principal-5"
					required
				/>
				{#if $errors.typepersonal}
					<p class="mt-1 text-xs text-red-600 dark:text-red-400">{$errors.typepersonal}</p>
				{/if}
			</div>

			<!-- Telefone -->
			<div>
				<label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Telefone (apenas números)
				</label>
				<input
					type="text"
					id="phone"
					name="phone"
					bind:value={$form.phone}
					placeholder="11999999999"
					class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-principal-5 focus:outline-none focus:ring-1 focus:ring-principal-5"
					required
				/>
				{#if $errors.phone}
					<p class="mt-1 text-xs text-red-600 dark:text-red-400">{$errors.phone}</p>
				{/if}
			</div>

			<!-- Data de Nascimento -->
			<div>
				<label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Data de Nascimento/Fundação
				</label>
				<input
					type="date"
					id="date"
					name="date"
					bind:value={$form.date}
					class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-principal-5 focus:outline-none focus:ring-1 focus:ring-principal-5"
					required
				/>
				{#if $errors.date}
					<p class="mt-1 text-xs text-red-600 dark:text-red-400">{$errors.date}</p>
				{/if}
			</div>

			<!-- Botão Submit -->
			<button
				type="submit"
				class="w-full rounded-md bg-principal-5 px-4 py-2 text-white font-semibold hover:bg-principal-6 focus:outline-none focus:ring-2 focus:ring-principal-5 focus:ring-offset-2 transition-colors"
			>
				Criar Perfil
			</button>
		</form>

		<div class="mt-6 text-center">
			<form method="POST" action="/auth/signout">
				<button
					type="submit"
					class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
				>
					Sair
				</button>
			</form>
		</div>
	</div>
</div>
