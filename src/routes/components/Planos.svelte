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
				class="hover:shadow-principal-4 flex w-80 flex-col items-stretch justify-between gap-4 rounded-lg bg-zinc-50 p-5 text-center shadow-lg transition-transform duration-300 ease-in hover:scale-105"
			>
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={card.image} />
				<h3 class="text-lg font-bold md:text-2xl">{card.title}</h3>
				<span class="text-md font-semibold text-zinc-600 italic md:text-lg">{card.subtitle}</span>
				<p class="md:text-md h-24 text-sm">
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
			class="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-[#00000080] backdrop-blur-xs"
			aria-hidden="true"
			onclick={() => (planOpen = !planOpen)}
		>
			<div class="relative flex max-w-md flex-col gap-4 rounded-lg bg-white p-8">
				<button class="hover:text-principal-4 absolute top-[-5px] right-1 text-4xl font-semibold">
					&times;
				</button>
				<h2 class="text-xl font-bold">{cards[indxPlan].title}</h2>
				<span class="text-lg font-semibold">Descrição:</span>
				<p class="text-md text-justify">{cards[indxPlan].description}</p>
				<ul class="list-disc text-justify">
					{#each cards[indxPlan].list as list}
						<li>{list}</li>
					{/each}
				</ul>
				<span class="text-lg font-semibold">Benefícios:</span>
				<ul class="list-item text-justify">
					{#each cards[indxPlan].ben as ben}
						<li>{ben}</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</section>

<style>
</style>
