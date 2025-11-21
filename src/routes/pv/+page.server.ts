import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	// Proteção desativada para testes
	// if (!user) {
	// 	redirect(303, '/');
	// }

	const { data: profile, error } = await supabase
		.from('profile')
		.select('id, id_auth, name, type, typepersonal, phone, date, age, description, caract, tags')
		.eq('id_auth', user.id)
		.single();
	
	if (error) {
		console.error('Erro ao carregar perfil:', error);
		console.error('User ID:', user.id);
		console.error('Error code:', error.code);
		console.error('Error details:', JSON.stringify(error, null, 2));
		
		// Se o erro for PGRST116, significa que não há registro
		if (error.code === 'PGRST116') {
			redirect(303, '/setup-perfil');
		}
		
		throw new Error(`Erro ao carregar perfil: ${error.message}`);
	}
	
	if (!profile) {
		redirect(303, '/setup-perfil');
	}
	
	return { profile };
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const age = formData.get('age') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (user) {
			try {
				await supabase.from('profile').update({ name: name, age: age }).eq('id_auth', user.id);
				await supabase.auth.updateUser({ email: email, password: password });
			} catch (error) {
				console.error(error);
				redirect(303, '/auth/error');
			} finally {
				redirect(303, '/auth');
			}
		}
	}
};
