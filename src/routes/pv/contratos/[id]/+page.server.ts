import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase, user } }) => {
	if (!user) {
		throw error(401, 'Não autorizado');
	}

	const { data: contract, error: dbError } = await supabase
		.from('contracts')
		.select('*, creator:id_creator(name), contracted:id_contratado(name)')
		.eq('id', params.id)
		.single();

	if (dbError || !contract) {
		throw error(404, 'Contrato não encontrado');
	}

	return { contract };
};
