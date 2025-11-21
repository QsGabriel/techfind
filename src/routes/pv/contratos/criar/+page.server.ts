import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	if (!user) {
		throw redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('profile')
		.select()
		.eq('id_auth', user.id)
		.single();

	return { profile };
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const data_ini = new Date(formData.get('data_ini') as string) as Date;
		const prazo = parseInt(formData.get('prazo') as string);
		const objetivo = formData.get('objetivo') as string;
		const valor = parseFloat(formData.get('valor') as string);
		const id_creator = formData.get('id_creator') as string;
		const assinatura_hash = formData.get('assinatura_hash') as string;
		const created_at = new Date() as Date;

		try {
			const { data, error: dbError } = await supabase.from('contracts').insert({
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
						message: 'Você não tem permissão para criar contratos'
					});
				}
				return fail(500, {
					success: false,
					message: 'Erro ao criar contrato. Tente novamente.'
				});
			}

			throw redirect(303, '/pv/contratos');
		} catch (error) {
			if (error instanceof Response) {
				throw error;
			}
			console.error('Erro inesperado:', error);
			return fail(500, {
				success: false,
				message: 'Erro inesperado ao criar contrato'
			});
		}
	}
};
