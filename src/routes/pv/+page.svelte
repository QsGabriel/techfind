<script>
	import { Button } from 'bits-ui';
	import { User, Briefcase, Bell, FileText, Search, ShoppingBag } from '@lucide/svelte';
	import { fly, scale } from 'svelte/transition';
	import AccessibilityControls from '../components/AccessibilityControls.svelte';

	let { data } = $props();
	
	const menuItems = data.profile.type === 1
		? [
			{ name: 'Perfil', href: 'pv/perfil', icon: User, description: 'Gerencie suas informações pessoais' },
			{ name: 'Projetos', href: 'pv/projetos', icon: Briefcase, description: 'Veja seus projetos ativos' },
			{ name: 'Notificações', href: 'pv/notificacoes', icon: Bell, description: 'Acompanhe suas notificações' }
		]
		: [
			{ name: 'Perfil', href: 'pv/perfil', icon: User, description: 'Gerencie suas informações pessoais' },
			{ name: 'Serviços', href: 'pv/servicos', icon: ShoppingBag, description: 'Explore serviços disponíveis' },
			{ name: 'Contratos', href: 'pv/contratos', icon: FileText, description: 'Gerencie seus contratos' }
		];

	const userType = data.profile.type === 1 ? 'Prestador' : 'Cliente';
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-principal-1/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
	<!-- Hero Section -->
	<div class="relative overflow-hidden">
		<!-- Background Pattern -->
		<div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
		
		<!-- Content -->
		<div class="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
			<!-- Welcome Message -->
			<div class="text-center" transition:fly={{ y: -20, duration: 600 }}>
				<div class="mb-4 inline-block rounded-full bg-principal-5/10 dark:bg-principal-5/20 px-4 py-1.5">
					<span class="text-sm font-medium text-principal-6 dark:text-principal-4">
						{userType}
					</span>
				</div>
				<h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
					Bem-vindo de volta,
					<span class="block bg-gradient-to-r from-principal-6 to-principal-4 bg-clip-text text-transparent">
						{data.profile?.name}!
					</span>
				</h1>
				<p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
					{data.profile.type === 1 
						? 'Gerencie seus projetos, acompanhe notificações e encontre novas oportunidades.' 
						: 'Explore serviços, gerencie contratos e encontre os melhores profissionais.'}
				</p>
			</div>

		<!-- Quick Actions Grid -->
		<div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
			{#each menuItems as item, i}
				{@const Icon = item.icon}
				<a
					href={item.href}
					class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-2xl hover:ring-principal-5 hover:-translate-y-1"
					transition:scale={{ delay: i * 100, duration: 400 }}
				>
					<!-- Icon Background -->
					<div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-principal-5/5 dark:bg-principal-5/10 transition-transform duration-300 group-hover:scale-150"></div>
					
					<!-- Icon -->
					<div class="relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-principal-5 to-principal-6 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
						<Icon class="h-7 w-7" />
					</div>						<!-- Content -->
						<h3 class="relative text-xl font-bold text-gray-900 dark:text-white mb-2">
							{item.name}
						</h3>
						<p class="relative text-sm text-gray-600 dark:text-gray-400">
							{item.description}
						</p>

						<!-- Arrow Icon -->
						<div class="relative mt-4 flex items-center text-principal-6 dark:text-principal-4 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							Acessar
							<svg class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
							</svg>
						</div>
					</a>
				{/each}
			</div>

			<!-- Search CTA -->
			<div class="mt-16" transition:fly={{ y: 20, delay: 400, duration: 600 }}>
				<a
					href="pv/pesquisa"
					class="group relative mx-auto flex max-w-2xl items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-principal-5 to-principal-6 p-8 shadow-2xl transition-all duration-300 hover:shadow-principal-5/50 hover:scale-[1.02]"
				>
					<!-- Background Effect -->
					<div class="absolute inset-0 bg-gradient-to-r from-principal-6 to-principal-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
					
					<!-- Content -->
					<div class="relative flex-1">
						<div class="mb-2 flex items-center gap-2">
							<Search class="h-6 w-6 text-white" />
							<h3 class="text-2xl font-bold text-white">
								Começar Pesquisa
							</h3>
						</div>
						<p class="text-white/90 text-sm">
							{data.profile.type === 1 
								? 'Encontre novos projetos e oportunidades' 
								: 'Descubra os melhores profissionais para seu projeto'}
						</p>
					</div>

					<!-- Arrow -->
					<div class="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/30">
						<svg class="h-6 w-6 text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</div>
				</a>
			</div>

			<!-- Stats Cards (Optional) -->
			<div class="mt-16 grid gap-6 sm:grid-cols-3" transition:fly={{ y: 20, delay: 500, duration: 600 }}>
				<div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
					<div class="text-3xl font-bold text-principal-6 dark:text-principal-4">
						{data.profile.type === 1 ? '0' : '0'}
					</div>
					<div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
						{data.profile.type === 1 ? 'Projetos Ativos' : 'Contratos Ativos'}
					</div>
				</div>
				<div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
					<div class="text-3xl font-bold text-principal-6 dark:text-principal-4">0</div>
					<div class="mt-1 text-sm text-gray-600 dark:text-gray-400">Notificações</div>
				</div>
				<div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
					<div class="text-3xl font-bold text-principal-6 dark:text-principal-4">
						{data.profile.type === 1 ? '0' : '0'}
					</div>
					<div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
						{data.profile.type === 1 ? 'Avaliações' : 'Serviços Salvos'}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Accessibility Controls -->
<AccessibilityControls />

<style>
	.bg-grid-pattern {
		background-image: 
			linear-gradient(to right, rgb(0 0 0 / 0.05) 1px, transparent 1px),
			linear-gradient(to bottom, rgb(0 0 0 / 0.05) 1px, transparent 1px);
		background-size: 40px 40px;
	}

	:global(.dark) .bg-grid-pattern {
		background-image: 
			linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px),
			linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px);
	}
</style>
