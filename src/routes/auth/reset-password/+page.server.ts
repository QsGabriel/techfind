import { redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const updatePasswordSchema = z.object({
	password: z.string()
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.regex(/[a-z]/, 'A senha deve conter letras minúsculas')
		.regex(/[A-Z]/, 'A senha deve conter letras maiúsculas')
		.regex(/[0-9]/, 'A senha deve conter números'),
	confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
	message: 'As senhas não coincidem',
	path: ['confirmPassword']
});

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	// Verifica se há um token de recuperação de senha na URL
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');

	if (!token_hash || type !== 'recovery') {
		throw redirect(303, '/?error=invalid-recovery-link');
	}

	// Verifica se o token é válido
	const { data: { session }, error } = await supabase.auth.verifyOtp({
		token_hash,
		type: 'recovery'
	});

	if (error || !session) {
		console.error('Erro ao verificar token de recuperação:', error);
		throw redirect(303, '/?error=expired-recovery-link');
	}

	const form = await superValidate(zod(updatePasswordSchema));
	return { form };
};

export const actions: Actions = {
	updatePassword: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updatePasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase.auth.updateUser({
			password: form.data.password
		});

		if (error) {
			console.error('Erro ao atualizar senha:', error);
			return message(form, 'Erro ao atualizar senha. Tente novamente.', {
				status: 400
			});
		}

		return message(form, 'Senha atualizada com sucesso!');
	}
};
