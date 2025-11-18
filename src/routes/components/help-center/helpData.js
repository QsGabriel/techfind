export const categories = [
	{
		id: 'account',
		title: 'Cadastro e Conta',
		icon: 'user',
		description: 'Gerencie seu perfil e configurações'
	},
	{
		id: 'how-it-works',
		title: 'Como funciona a TechFind',
		icon: 'lightbulb',
		description: 'Entenda nossa plataforma'
	},
	{
		id: 'hire',
		title: 'Contratação de Serviços',
		icon: 'briefcase',
		description: 'Contrate e gerencie serviços'
	},
	{
		id: 'security',
		title: 'Privacidade e Segurança',
		icon: 'shield',
		description: 'Proteção dos seus dados'
	},
	{
		id: 'payments',
		title: 'Pagamentos e Planos',
		icon: 'credit-card',
		description: 'Informações sobre pagamentos'
	}
];

export const faqs = [
	{
		id: 1,
		question: 'Como faço para criar uma conta?',
		answer:
			'Para criar uma conta, clique no botão "Cadastre-se" no topo da página. Você precisará fornecer seu nome, e-mail e criar uma senha segura. Após preencher o formulário, você receberá um e-mail de confirmação para ativar sua conta.',
		category: 'account'
	},
	{
		id: 2,
		question: 'Esqueci minha senha, como recupero?',
		answer:
			'Na tela de login, clique em "Esqueci minha senha". Digite seu e-mail cadastrado e enviaremos instruções para redefinir sua senha. Verifique também sua caixa de spam caso não encontre o e-mail.',
		category: 'account'
	},
	{
		id: 3,
		question: 'Como edito minhas informações de perfil?',
		answer:
			'Acesse sua conta e vá até a seção "Perfil". Lá você poderá editar suas informações pessoais, foto de perfil, descrição profissional e dados de contato. Não se esqueça de salvar as alterações.',
		category: 'account'
	},
	{
		id: 4,
		question: 'O que é a TechFind e como ela funciona?',
		answer:
			'A TechFind é uma plataforma que conecta empresas com soluções tecnológicas através de IA. Nossa plataforma identifica suas necessidades e recomenda os melhores profissionais e serviços de tecnologia para seu negócio.',
		category: 'how-it-works'
	},
	{
		id: 5,
		question: 'Como a IA da TechFind me ajuda a encontrar serviços?',
		answer:
			'Nossa inteligência artificial analisa seu perfil, necessidades e requisitos específicos. Com base nessas informações, ela compara com nossa base de prestadores de serviços e faz recomendações personalizadas que melhor atendem suas demandas.',
		category: 'how-it-works'
	},
	{
		id: 6,
		question: 'A plataforma é gratuita?',
		answer:
			'Sim! Criar uma conta e explorar nossa plataforma é totalmente gratuito. Temos também planos premium que oferecem recursos adicionais como prioridade no atendimento e ferramentas avançadas de gestão.',
		category: 'how-it-works'
	},
	{
		id: 7,
		question: 'Como faço para contratar um serviço?',
		answer:
			'Após encontrar o serviço ideal, clique em "Contratar" na página do prestador. Você será direcionado para definir escopo, prazos e valores. Após acordo mútuo, o contrato é gerado automaticamente na plataforma.',
		category: 'hire'
	},
	{
		id: 8,
		question: 'Posso cancelar um contrato já iniciado?',
		answer:
			'Sim, mas isso depende dos termos acordados com o prestador. Acesse "Meus Contratos", selecione o contrato desejado e clique em "Solicitar Cancelamento". O prestador será notificado e vocês poderão negociar os termos.',
		category: 'hire'
	},
	{
		id: 9,
		question: 'Como avalio o trabalho de um prestador?',
		answer:
			'Após a conclusão do serviço, você receberá uma notificação para avaliar. Acesse "Meus Contratos", selecione o serviço concluído e deixe sua avaliação com estrelas e comentário. Isso ajuda outros usuários!',
		category: 'hire'
	},
	{
		id: 10,
		question: 'Meus dados estão seguros na plataforma?',
		answer:
			'Sim! Utilizamos criptografia de ponta a ponta e seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados). Seus dados pessoais e financeiros são protegidos com os mais altos padrões de segurança.',
		category: 'security'
	},
	{
		id: 11,
		question: 'A TechFind compartilha meus dados com terceiros?',
		answer:
			'Não compartilhamos seus dados pessoais com terceiros para fins comerciais. Utilizamos seus dados apenas para melhorar nossos serviços e conectar você com prestadores adequados. Leia nossa Política de Privacidade para mais detalhes.',
		category: 'security'
	},
	{
		id: 12,
		question: 'Como denuncio um comportamento inadequado?',
		answer:
			'Se você identificar qualquer comportamento inadequado ou suspeito, clique em "Denunciar" no perfil do usuário ou entre em contato diretamente com nosso suporte. Levamos todas as denúncias a sério.',
		category: 'security'
	},
	{
		id: 13,
		question: 'Quais formas de pagamento são aceitas?',
		answer:
			'Aceitamos cartões de crédito (Visa, Mastercard, Elo), cartões de débito, PIX e boleto bancário. Os pagamentos são processados de forma segura através de parceiros certificados.',
		category: 'payments'
	},
	{
		id: 14,
		question: 'Como funcionam os planos premium?',
		answer:
			'Oferecemos três planos: Básico (gratuito), Avançado e Enterprise. Os planos pagos oferecem recursos como busca prioritária, suporte dedicado, análises avançadas e número ilimitado de contratos. Confira a seção "Planos" para mais detalhes.',
		category: 'payments'
	},
	{
		id: 15,
		question: 'Posso cancelar meu plano premium a qualquer momento?',
		answer:
			'Sim! Você pode cancelar seu plano premium a qualquer momento sem multas. Acesse "Configurações" > "Assinatura" > "Cancelar Plano". Você manterá os benefícios até o fim do período já pago.',
		category: 'payments'
	},
	{
		id: 16,
		question: 'Como funciona o reembolso de pagamentos?',
		answer:
			'Reembolsos são processados conforme os termos acordados no contrato. Em caso de disputa, nossa equipe de mediação analisa o caso. O prazo de reembolso varia de 5 a 10 dias úteis, dependendo da forma de pagamento.',
		category: 'payments'
	}
];
