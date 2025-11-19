<script>
	import basic from '$img/basic.svelte';
	import enterprise from '$img/enterprise.svelte';
	import advanced from '$img/advanced.svelte';
	import { fade } from 'svelte/transition';

	let planOpen = $state(false);
	let indxPlan = $state(0);
	const btn =
		'border-none flex items-center justify-center bg-principal-5 hover:bg-principal-3 rounded-xl py-3 px-4 font-semibold cursor-pointer transition-colors duration-300 ease-in';
	const cards = [
		{
			image: basic,
			title: 'Plano Basic',
			subtitle: 'O nosso plano Custo-benefício imperdível!',
			paragraph:
				'Acesso à plataforma, com todo o suporte e consultoria de nível básico, necessário para uma pequena empresa.',
			description:
				'O Plano Basic é ideal para pequenas empresas que buscam acesso a serviços de tecnologia com suporte essencial.',
			list: [
				'Acesso à Plataforma: Utilização da plataforma de serviços tecnológicos com funcionalidades básicas.',
				'Suporte Técnico: Atendimento ao cliente com resolução de problemas comuns via chat e e-mail.',
				'Consultoria Básica: Orientação sobre as melhores práticas em tecnologia, incluindo sugestões de ferramentas e serviços.'
			],
			ben: [
				'Acesso simplificado a serviços tecnológicos.',
				'Suporte confiável para questões do dia a dia.',
				'Consultoria básica para impulsionar o uso da tecnologia.'
			]
		},
		{
			image: enterprise,
			title: 'Plano Enterprise',
			subtitle: 'O nosso plano comercial completo!',
			paragraph:
				'Todos os recursos do plano Basic, suporte avançado, consultoria tecnológica completa e suporte on-demmand.',
			description:
				'O Plano Enterprise é voltado para médias empresas que necessitam de suporte avançado e consultoria mais aprofundada.',
			list: [
				'Todos os Recursos do Plano Basic: Inclui todos os benefícios do plano anterior.',
				'Suporte Avançado: Atendimento especializado com tempo de resposta mais rápido.',
				'Consultoria Tecnológica Completa: Análises detalhadas das necessidades tecnológicas da empresa, recomendações de software e hardware e planejamento de estratégias de TI.',
				'Consultoria Específica: Consultoria disponível sob demanda, permitindo que a empresa solicite ajuda sempre que necessário.',
				'Business Intelligence (BI): Análise do uso da tecnologia na empresa e sugestões de melhorias.'
			],
			ben: [
				'Abordagem mais robusta e estratégica para médias empresas.',
				'Suporte mais ágil e consultorias aprofundadas para lidar com desafios complexos.'
			]
		},
		{
			image: advanced,
			title: 'Plano Advanced',
			subtitle: 'Consultoria tecnológica personalizada de alto nível!',
			paragraph:
				'Todos os recursos do plano Empresarial, gerenciamento de projetos, governança corporativa e suporte customizado.',
			description:
				'O Plano Advanced é destinado a empresas que buscam um gerenciamento completo de projetos e governança corporativa em tecnologia.',
			list: [
				'Todos os Recursos do Plano Enterprise e do Plano Basic: Inclui todos os benefícios dos planos anteriores.',
				'Gerenciamento de Projetos: Planejamento, execução e monitoramento de projetos tecnológicos, com entregas programadas e relatórios de progresso.',
				'Governança Corporativa: Desenvolvimento e implementação de políticas de governança em tecnologia, assegurando conformidade e segurança.',
				'Suporte Customizado: Consultoria adaptada às necessidades específicas da empresa, com reuniões regulares para ajustes e feedback.',
				'Treinamentos Personalizados: Sessões de capacitação para a equipe da empresa, focando nas ferramentas e sistemas utilizados.'
			],
			ben: [
				'Maior controle e eficiência em projetos tecnológicos.',
				'Adoção de melhores práticas de governança, aumentando a segurança e a conformidade.',
				'Suporte personalizado que se adapta ao crescimento e às mudanças da empresa.'
			]
		}
	];
</script>

<section id="planos" class="relative min-h-svh p-5 pt-32 text-center">
	<h2 class="text-principal-6 text-3xl font-semibold">Nossos Planos</h2>
	<h3 class="my-4 text-5xl font-bold">Escolha o melhor plano para o seu negócio</h3>

	<div class="mt-8 flex flex-col flex-wrap items-center justify-center gap-6 md:flex-row">
		{#each cards as card, id}
			<div
				class="plano-card flex w-80 flex-col items-stretch justify-between gap-4 rounded-lg bg-zinc-50 p-5 text-center shadow-lg"
			>
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={card.image} />
				<h3 class="plano-title text-lg font-bold md:text-2xl">{card.title}</h3>
				<span class="plano-subtitle text-md font-semibold text-zinc-600 italic md:text-lg">{card.subtitle}</span>
				<p class="plano-description md:text-md h-24 text-sm">
					{card.paragraph}
				</p>
				<button
					class={btn}
					onclick={() => {
						planOpen = !planOpen;
						indxPlan = id;
					}}>Saiba Mais</button
				>
			</div>
		{/each}
	</div>

	{#if planOpen}
		<div
			transition:fade={{ duration: 300 }}
			class="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-[#00000080] backdrop-blur-sm p-4"
			aria-hidden="true"
			onclick={() => (planOpen = !planOpen)}
		>
			<div 
				class="plano-modal relative flex max-w-2xl w-full flex-col gap-6 rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
				onclick={(e) => e.stopPropagation()}
			>
				<button 
					class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-principal-4 hover:text-white transition-all duration-300 text-2xl font-bold"
					onclick={() => (planOpen = !planOpen)}
				>
					&times;
				</button>
				
				<div class="mt-2">
					<h2 class="text-3xl font-bold text-principal-6 mb-2">{cards[indxPlan].title}</h2>
					<span class="text-lg font-semibold text-zinc-500 italic">{cards[indxPlan].subtitle}</span>
				</div>

				<div class="border-t border-gray-200 pt-4">
					<h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-principal-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Descrição
					</h3>
					<p class="text-base text-gray-700 leading-relaxed">{cards[indxPlan].description}</p>
				</div>

				<div class="border-t border-gray-200 pt-4">
					<h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-principal-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
						Recursos Inclusos
					</h3>
					<ul class="space-y-2">
						{#each cards[indxPlan].list as list}
							<li class="flex items-start gap-3 text-gray-700">
								<svg class="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
								<span class="text-base">{list}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="border-t border-gray-200 pt-4">
					<h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-principal-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
						</svg>
						Benefícios
					</h3>
					<ul class="space-y-2">
						{#each cards[indxPlan].ben as ben}
							<li class="flex items-start gap-3 text-gray-700">
								<svg class="h-6 w-6 text-principal-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span class="text-base">{ben}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="border-t border-gray-200 pt-6 flex gap-4">
					<button 
						class="flex-1 bg-principal-5 hover:bg-principal-3 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
						onclick={() => (planOpen = !planOpen)}
					>
						Fechar
					</button>
					<button 
						class="flex-1 bg-principal-6 hover:bg-principal-4 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
					>
						Contratar Agora
					</button>
				</div>
			</div>
		</div>
	{/if}
</section>

<style>
	.plano-card {
		position: relative;
		cursor: pointer;
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.plano-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(217, 85, 24, 0.1) 0%, rgba(217, 85, 24, 0) 100%);
		opacity: 0;
		transition: opacity 0.4s ease;
		z-index: 0;
	}

	.plano-card:hover {
		transform: translateY(-12px) scale(1.02);
		box-shadow: 0px 20px 40px rgba(217, 85, 24, 0.3), 0px 0px 0px 1px rgba(217, 85, 24, 0.2);
	}

	.plano-card:hover::before {
		opacity: 1;
	}

	.plano-card > :global(*) {
		position: relative;
		z-index: 1;
	}

	.plano-card :global(svg) {
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.plano-card:hover :global(svg) {
		transform: scale(1.1) rotate(5deg);
		filter: drop-shadow(0 10px 20px rgba(217, 85, 24, 0.3));
	}

	.plano-title {
		transition: all 0.3s ease;
	}

	.plano-card:hover .plano-title {
		color: #d95518;
		transform: translateY(-2px);
	}

	.plano-subtitle,
	.plano-description {
		transition: all 0.3s ease;
	}

	.plano-card:hover .plano-description {
		color: #1a1a1a;
	}

	/* Modal moderno com scroll suave */
	.plano-modal {
		animation: modalSlideIn 0.3s ease-out;
	}

	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(-20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.plano-modal::-webkit-scrollbar {
		width: 8px;
	}

	.plano-modal::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}

	.plano-modal::-webkit-scrollbar-thumb {
		background: #d95518;
		border-radius: 10px;
	}

	.plano-modal::-webkit-scrollbar-thumb:hover {
		background: #b84415;
	}

	/* Tema escuro */
	:global([data-theme='dark']) .plano-card {
		background-color: #1f2937;
		box-shadow: 0px 0px 12px 4px rgba(0, 0, 0, 0.3);
	}

	:global([data-theme='dark']) .plano-card:hover {
		box-shadow: 0px 20px 40px rgba(217, 85, 24, 0.5), 0px 0px 0px 1px rgba(217, 85, 24, 0.3);
	}

	:global([data-theme='dark']) .plano-title {
		color: #ffffff;
	}

	:global([data-theme='dark']) .plano-card:hover .plano-title {
		color: #ff9500;
	}

	:global([data-theme='dark']) .plano-subtitle,
	:global([data-theme='dark']) .plano-description {
		color: #d1d5db;
	}

	:global([data-theme='dark']) .plano-card:hover .plano-description {
		color: #ffffff;
	}

	:global([data-theme='dark']) .plano-modal {
		background-color: #1f2937;
		border: 1px solid #374151;
	}

	:global([data-theme='dark']) .plano-modal h2,
	:global([data-theme='dark']) .plano-modal h3,
	:global([data-theme='dark']) .plano-modal span,
	:global([data-theme='dark']) .plano-modal p,
	:global([data-theme='dark']) .plano-modal li {
		color: #ffffff;
	}

	:global([data-theme='dark']) .plano-modal .border-gray-200 {
		border-color: #374151;
	}

	:global([data-theme='dark']) .plano-modal button:first-of-type {
		background-color: #374151;
		color: #ffffff;
	}

	:global([data-theme='dark']) .plano-modal button:first-of-type:hover {
		background-color: #4b5563;
	}

	:global([data-theme='dark']) .plano-modal::-webkit-scrollbar-track {
		background: #374151;
	}
</style>
