<script>
	import { MessageCircle, Phone, Mail, CircleAlert } from '@lucide/svelte';
	const boxes = [
		{
			image: MessageCircle,
			title: 'Chat online',
			paragraph: 'Tire suas dúvidas rapidamente através do nosso chat online.'
		},
		{
			image: Phone,
			title: 'Atendimento telefônico',
			paragraph: 'Fale com um de nossos especialistas por telefone.'
		},
		{
			image: Mail,
			title: 'Suporte por e-mail',
			paragraph: 'Envie um e-mail para nossa equipe de suporte.'
		},
		{
			image: CircleAlert,
			title: 'Central de Ajuda',
			paragraph: 'Encontre as respostas para suas perguntas na nossa central de ajuda.'
		}
	];
</script>

<section id="support" class="flex min-h-svh flex-col items-center gap-4 pt-32 text-center">
	<h1 class="text-2xl font-bold">Atendimento personalizado e Suporte 24/7</h1>
	{#each boxes as box}
		{@const Icon = box.image}
		<div class="my-3 flex w-64 flex-col items-center gap-3 rounded-xl p-5 lg:w-96">
			<Icon size="96" fill="#ff6800" />
			<h2 class="text-xl font-bold">{box.title}</h2>
			<p>{box.paragraph}</p>
		</div>
	{/each}
</section>

<style>
</style>
