import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	if (user) {
		const { data: profile } = await supabase
			.from('profile')
			.select()
			.eq('id_auth', user.id)
			.single();
		const { data: contracts } = await supabase
			.from('contracts')
			.select('*, creator:id_creator(name), contracted:id_contratado(name)')
			.eq('id_creator', profile.id);
		return { contracts: contracts, profile: profile };
	}
	return null;
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		// console.log('create: ', formData);

		const data_ini = new Date(formData.get('data_ini') as string) as Date;
		const prazo = parseInt(formData.get('prazo') as string);
		const objetivo = formData.get('objetivo') as string;
		const valor = parseFloat(formData.get('valor') as string);
		const id_creator = formData.get('id_creator') as string;
		const assinatura_hash = formData.get('assinatura_hash') as string;
		const created_at = new Date() as Date;

		// console.log(data_ini, prazo, objetivo, valor, id_creator, assinatura_hash);

		try {
			const { data: data, error: dbError } = await supabase.from('contracts').insert({
				data_ini: data_ini,
				prazo: prazo,
				objetivo: objetivo,
				valor: valor,
				id_creator: id_creator,
				assinatura_hash: assinatura_hash,
				created_at: created_at
			});

			if (dbError) {
				console.error('Erro ao salvar dados do contrato no banco:', dbError.message);
				if (dbError.message.includes('violates row-level security policy')) {
					return fail(403, {
						success: false,
						message:
							'Erro de permissão: Você não tem autorização para criar este contrato ou os dados fornecidos violam as políticas de segurança.'
					});
				}
				return fail(500, {
					success: false,
					message: `Erro ao salvar contrato: ${dbError.message}`
				});
			} else {
				if (data) {
					console.log('Contrato enviado com sucesso!', data);
					return { success: true, message: 'Contrato enviado com sucesso!', contract: data[0] };
				}
				return fail(500, { success: false, message: 'Data está fazia' });
			}
		} catch (error) {
			console.error('Erro inesperado durante o envio:', error);
			return fail(500, { success: false, message: 'Ocorreu um erro inesperado no servidor.' });
		}
	}
};
