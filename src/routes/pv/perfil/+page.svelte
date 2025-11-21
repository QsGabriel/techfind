<script>
	import { Button, Label } from 'bits-ui';
	import { ChevronLeft, User, Mail, Phone, Calendar, Lock, FileText } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import AccessibilityControls from '../../components/AccessibilityControls.svelte';

	let { data } = $props();
	let { profile } = $derived(data);
</script>

<!-- Background Gradient -->
<div class="fixed inset-0 -z-10 bg-gradient-to-br from-principal-1 via-principal-2 to-principal-3 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

<!-- Accessibility Controls -->
<AccessibilityControls />

<div class="min-h-screen p-4 sm:p-6 lg:p-8">
	<!-- Header with Back Button -->
	<div class="mb-8">
		<Button.Root
			href="/pv"
			class="group inline-flex items-center gap-2 rounded-xl bg-white/90 dark:bg-gray-800/90 px-4 py-2 backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg border border-gray-200 dark:border-gray-700"
		>
			<ChevronLeft class="size-5 transition-transform group-hover:-translate-x-1" />
			<span class="font-medium">Voltar</span>
		</Button.Root>
	</div>

	<!-- Hero Section -->
	<div class="mb-12 text-center" in:fade={{ duration: 300 }}>
		<div class="flex items-center justify-center gap-3 mb-4">
			<div class="rounded-xl bg-gradient-to-br from-principal-5 to-principal-6 p-3 shadow-lg">
				<User class="size-8 text-white" strokeWidth={2.5} />
			</div>
		</div>
		<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">Meu Perfil</h1>
		<p class="text-lg text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais</p>
	</div>

	<!-- Profile Form -->
	<div class="max-w-3xl mx-auto">
		<form
			method="post"
			action="?/signup"
			class="rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl p-8 space-y-6"
		>
			<!-- Name Field -->
			<div class="space-y-2">
				<Label.Root for="name" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
					<User class="size-4" />
					Nome Completo
				</Label.Root>
				<input
					type="text"
					name="name"
					value={profile?.name}
					class="w-full rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-principal-5 focus:border-transparent transition-all outline-none"
				/>
			</div>

			<!-- Description Field -->
			<div class="space-y-2">
				<Label.Root for="descricao" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
					<FileText class="size-4" />
					Descrição
				</Label.Root>
				<input
					type="text"
					name="descricao"
					value={profile?.description}
					class="w-full rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-principal-5 focus:border-transparent transition-all outline-none"
				/>
			</div>

			<!-- Date Field -->
			<div class="space-y-2">
				<Label.Root for="date" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
					<Calendar class="size-4" />
					Data para o trabalho
				</Label.Root>
				<input
					type="date"
					min={new Date().toISOString().split('T')[0]}
					value={profile?.date}
					name="date"
					class="w-full rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-principal-5 focus:border-transparent transition-all outline-none"
				/>
			</div>

			<!-- Phone Field -->
			<div class="space-y-2">
				<Label.Root for="phone" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
					<Phone class="size-4" />
					Telefone
				</Label.Root>
				<input
					type="text"
					name="phone"
					value={profile?.phone}
					placeholder="(00)00000-0000"
					class="w-full rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-principal-5 focus:border-transparent transition-all outline-none"
				/>
			</div>

			<!-- Email Field -->
			<div class="space-y-2">
				<Label.Root for="email" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
					<Mail class="size-4" />
					Email
				</Label.Root>
				<input
					type="email"
					name="email"
					value={data.user?.email}
					class="w-full rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-principal-5 focus:border-transparent transition-all outline-none"
				/>
			</div>

			<!-- Password Field -->
			<div class="space-y-2">
				<Label.Root for="password" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
					<Lock class="size-4" />
					Senha
				</Label.Root>
				<input
					type="password"
					name="password"
					placeholder="Nova senha"
					class="w-full rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-principal-5 focus:border-transparent transition-all outline-none"
				/>
			</div>

			<!-- Submit Button -->
			<div class="flex justify-center pt-4">
				<Button.Root
					type="submit"
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-principal-5 to-principal-6 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
				>
					Atualizar Perfil
				</Button.Root>
			</div>
		</form>
	</div>
</div>
