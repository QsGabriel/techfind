import type { Actions, PageServerLoad } from './$types';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { GROQ_API_KEY } from '$env/static/private';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const groq = createGroq({ apiKey: GROQ_API_KEY });

const schemaPesquisa = z.object({
	negocio: z.string().min(1, { message: 'Negócio é obrigatório.' }),
	tipoProduto: z.string().min(1, { message: 'Produto/Serviço é obrigatório.' }),
	contratacao: z
		.enum(['', 'freelancer', 'clt'])
		.refine((e) => (e === '' ? false : true), { message: 'Selecione uma forma de contratação.' }),
	trabalho: z
		.enum(['', 'home office', 'presencial', 'hibrido'])
		.refine((e) => (e === '' ? false : true), { message: 'Selecione uma forma de trabalho.' }),
	time: z.date({ message: 'Selecione um tempo.' }),
	desc: z.string().min(1, { message: 'Descrição é obrigatório.' })
});

export const load: PageServerLoad = async ({ cookies }) => {
	const form = await superValidate(zod(schemaPesquisa));

	const api = cookies.get('api');
	if (!api) {
		cookies.set('api', JSON.stringify({}), {
			path: './pesquisa',
			maxAge: 60 * 60 * 24 // 24 hours
		});
	}

	return { formPesquisa: form, api: api };
};

export const actions = {
	pesquisar: async ({ request, locals: { supabase }, cookies }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(schemaPesquisa));

		if (!form.valid) {
			return setError(form, 'error de validação pesquisa.');
		}

		const example = ` baseado na tabela "profile" e no texto do usuário sobre o que ele necessita para a criação de uma aplicação, escreva, em markdown, quais os profissionais e como suas características vão ajudar nesse processo. No final da resposta deve ter as principais tags para a pesquisa. seguindo o seguinte padrão "As principais tags para a pesquisa são: mobile-android-ios-backend-fullstack" texto do usuário:${form?.data.desc} segmentação do produto:${form?.data.negocio} tipo de produto/serviço:${form?.data.tipoProduto} tabela profile: - id: number primary key; - id_auth: number foreign key; - name: string not_null; - type: enum[1, 2] not_null; - type_personal: string not_null; - phone: string not_null; - date: Date not_null; - desc: string; - caract: string; - tags: string; lista de tags: Desenvolvimento de Software-Linguagens de Programação-Frameworks-Desenvolvimento Web-Desenvolvimento Mobile-Frontend-Backend-Fullstack-Banco de Dados-SQL-NoSQL-Administração de Banco de Dados (DBA)-Sistemas Operacionais-Linux-Windows Server-Redes de Computadores-Segurança de Rede-Cibersegurança-Segurança da Informação (Infosec)-Firewall-VPN-Computação em Nuvem-Cloud Computing-AWS-Azure-Google Cloud Platform (GCP)-SaaS-PaaS-IaaS-Infraestrutura de TI-Servidores-Virtualização-Containers-Docker-Kubernetes-DevOps-Automação-Monitoramento de Sistemas-Backup e Recuperação-Ciência de Dados-Inteligência Artificial (IA)-Machine Learning (ML)-Big Data-Análise de Dados-Gerenciamento de Projetos-Metodologias Ágeis-Scrum-Kanban-ITIL-Arquitetura de Software-Microsserviços-APIs-Análise de Sistemas-Engenharia de Software-Suporte Técnico-Help Desk-Experiência do Usuário (UX)-Interface do Usuário (UI)-Pentesting-Criptografia-Redes Sem Fio (Wireless)-Data Center-Armazenamento (Storage)
exemplo: texto de usuário: gostaria de profissionais que de tecnologia para a criação de um site pessoal. profile 1: - id: 1; - id_auth: 1; - name: jubileu; - type: 1; - type_personal: 99999999999; - phone: 99999999999; - date: 2025-10-12; - desc: "sou um profissional apaixonado por tecnologia."; - caract: "profissional de tecnologia."; - tags: "frontend-backend-fullstack-postgreSQL"; profile 2: - id: 2; - id_auth: 2; - name: ana; - type: 1; - type_personal: 99999999999; - phone: 99999999999; - date: 2025-10-12; - desc: "sou uma profissional da área de Banco de dados."; - caract: "profissional de Banco de Dados."; - tags: "Banco de dados-backend-postgreSQL"; resposta: baseado na sua descrição, você necessita de profissionais na área de desenvolvimento web (frontend - tela, backend - banco de dados, métodos ágeis - para a coordenação e gerência) para a sua necessidade, os melhores profissionais área de tecnologia são: **1 profissional de banco de dados**; **3 profissionais fullstack**; **1 profissional de métodos ágeis**; Esses profissionais podem ser encontrados com as seguintes tags: Desenvolvimento de Software Testes de Software-Pentesting-Criptografia-Segurança da Informação-Qualidade de Software- `;

		const { text } = await generateText({
			model: groq('llama-3.3-70b-versatile'),
			prompt: example
		});

		let desc = text.split('Esses profissionais podem ser encontrados com as seguintes tags:')[0];
		desc =
			`# **Segmentação de Negócio:** ${form?.data.negocio}\n# **Tipo de Produto/Serviço:** ${form?.data.tipoProduto} \n# **Regime de contratação:** ${form?.data.contratacao}\n# **Regime de Trabalho:** ${form?.data.trabalho}\n# **Data até a pesquisa:** ${form?.data.time.toLocaleTimeString('pt-BR')}\n` +
			desc;

		const tags = text
			.split('Esses profissionais podem ser encontrados com as seguintes tags:')[1]
			.split('-')
			.map((value) => `tags.ilike.%${value.trim()}%`)
			.join(', ');

		const { data: usuarios } = await supabase
			.from('profile')
			.select()
			.eq('type', '1')
			// .lte('date', form?.data.time)
			.or(tags);

		cookies.set('api', JSON.stringify({ usuarios: usuarios, desc: desc, tags: tags }), {
			path: './pesquisa',
			maxAge: 60 * 60 * 24 // 24 hours
		});
		return {
			form,
			success: true,
			message: 'pesquisa realizada com sucesso'
		};
	}
} satisfies Actions;
