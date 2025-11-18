import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	if (user) {
		const { data: profile } = await supabase
			.from('profile')
			.select()
			.eq('id_auth', user.id)
			.single();
		return { profile: profile };
	}
	return null;
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const age = formData.get('age') as string;

		if (user) {
			const { error } = await supabase
				.from('profile')
				.update({ name: name, age: age })
				.eq('id_auth', user.id);
			if (error) {
				console.error(error);
				redirect(303, '/pv/error');
			} else {
				redirect(303, '/pv');
			}
		}
	}
};
