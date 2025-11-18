import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user }, url }) => {
	const userProfile = url.searchParams.get('user');
	const { data: userProf } = await supabase.from('profile').select().eq('id', userProfile).single();
	const { data: usuario } = await supabase
		.from('profile')
		.select()
		.eq('id_auth', user?.id)
		.single();
	const { data: contracts } = await supabase
		.from('contracts')
		.select()
		.eq('id_creator', usuario.id);
	console.log(contracts);
	return { usuario: userProf, contracts: contracts };
};

export const actions: Actions = {
	notification: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id_contratado = formData.get('id_contratado') as string;
		const id_contract = formData.get('contract') as string;
		try {
			await supabase
				.from('notifications')
				.insert({ id_contratado: id_contratado, id_contract: id_contract });
		} catch (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} finally {
			redirect(303, '/pv');
		}
	}
};
