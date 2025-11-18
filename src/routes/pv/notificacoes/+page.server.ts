import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	if (user) {
		const { data: profile, error: authError } = await supabase
			.from('profile')
			.select()
			.eq('id_auth', user.id)
			.single();
		if (authError) return;
		const { data: notConts, error: notError } = await supabase
			.from('notifications')
			.select('*, contract:contracts(*, creator:id_creator(name), contracted:id_contratado(name))')
			.eq('id_contratado', profile.id);
		if (notError) return;
		return { notConts: notConts, profile: profile };
	}
	return null;
};

export const actions: Actions = {
	assinar: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id_contract = formData.get('contract') as string;
		const id_contratado = formData.get('contratado') as string;
		const id_notification = formData.get('notification') as string;
		try {
			await supabase
				.from('contracts')
				.update({ id_contratado: id_contratado })
				.eq('id', id_contract);
			await supabase.from('notifications').delete().eq('id', id_notification);
		} catch (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} finally {
			redirect(303, '/pv');
		}
	}
};
