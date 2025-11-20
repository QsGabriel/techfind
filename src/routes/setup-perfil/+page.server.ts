import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schemaSetup = z.object({
	name: z.string().min(3, { message: 'Nome deve ter 3 caracteres no mínimo.' }),
	date: z
		.date({ message: 'Selecione uma data válida.' })
		.refine((data) => new Date(data).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)),
	radio: z.enum(['Cliente', 'Prestador']),
	typePersonal: z
		.string()
		.regex(/^\d+$/, { message: 'Deve ter apenas números.' })
		.min(11, { message: 'Deve ter pelo menos 11 dígitos.' })
		.max(14, { message: 'Deve ter no máximo 14 dígitos.' }),
	phone: z.string().min(11, { message: 'Deve ter pelo menos 11 dígitos.' })
});

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	// Proteção desativada para testes
	// if (!user) {
	// 	redirect(303, '/');
	// }

	// Verificar se já existe perfil
	if (user) {
		const { data: existingProfile } = await supabase
			.from('profile')
			.select('id')
			.eq('id_auth', user.id)
			.single();

		if (existingProfile) {
			// Se já existe perfil, redireciona para /pv
			redirect(303, '/pv');
		}
	}

	const formSetup = await superValidate(zod(schemaSetup));
	return { formSetup, email: user?.email || '' };
};

export const actions: Actions = {
	createProfile: async ({ request, locals: { supabase, user } }) => {
		// Proteção desativada para testes
		// if (!user) {
		// 	redirect(303, '/');
		// }

		const formData = await request.formData();
		const formSetup = await superValidate(formData, zod(schemaSetup));

		if (!formSetup.valid) {
			return setError(formSetup, 'Erro de validação');
		}

		if (!user) {
			return setError(formSetup, 'Usuário não autenticado');
		}

		const type = formData.get('radio') === 'Prestador' ? 1 : 2; // 1 = Prestador, 2 = Cliente
		const typePersonal = formData.get('typePersonal') as string;
		const phone = formData.get('phone') as string;
		const name = formData.get('name') as string;
		const date = formData.get('date') as string;

		// Inserir perfil do usuário
		const { error: profileError } = await supabase.from('profile').insert([
			{
				id_auth: user.id,
				type: type,
				name: name,
				typePersonal: typePersonal,
				phone: phone,
				date: date
			}
		]);

		if (profileError) {
			console.error('Erro ao criar perfil:', profileError);
			return setError(formSetup, 'Não foi possível criar o perfil. Tente novamente.');
		}

		// Redirecionar para a área privada
		redirect(303, '/pv');
	}
};
