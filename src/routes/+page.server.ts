import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schemaLogin = z.object({
	email: z.string().email('Email está vazio.'),
	password: z.string().min(6, { message: 'Senha deve ter 6 caracteres no mínimo.' })
});

const schemaSignup = z.object({
	name: z.string().min(3, { message: 'Nome deve ter 3 caracteres no mínimo.' }),
	date: z
		.date({ message: 'Selecione uma data que tenha disponibilidade.' })
		.refine((data) => new Date(data).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)),
	radio: z.enum(['Cliente', 'Prestador']),
	typePersonal: z
		.string()
		.regex(/^\d+$/, { message: 'Deve ter apenas os números.' })
		.min(11, { message: 'Deve ter mais de 11 digitos.' })
		.max(14, { message: 'Deve ter menos de 14 digitos.' }),
	phone: z.string().min(11, { message: 'Deve ter apenas os números.' }),
	email: z.string().email('Email está vazio.'),
	password: z.string().min(6, { message: 'Senha deve ter 6 caracteres no mínimo.' })
});

export const load: PageServerLoad = async () => {
	const formLogin = await superValidate(zod(schemaLogin));
	const formSignup = await superValidate(zod(schemaSignup));
	return { formLogin, formSignup };
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const formSignup = await superValidate(formData, zod(schemaSignup));
		if (!formSignup.valid) {
			return setError(formSignup, 'error de validação signup');
		}
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const type = formData.get('radio') === 'Cliente' ? 1 : 2;
		const typePersonal = formData.get('typePersonal') as string;
		const phone = formData.get('phone') as string;
		const name = formData.get('name') as string;
		const date = formData.get('date') as string;

		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) {
			return setError(formSignup, 'não foi possivel realizar o cadastro... tente novamente');
		} else {
			const prof = await supabase.from('profile').insert([
				{
					id_auth: data.user?.id,
					type: type,
					name: name,
					typePersonal: typePersonal,
					phone: phone,
					date: date
				}
			]);
			if (prof.error) {
				return setError(formSignup, 'não foi possivel realizar o cadastro... tente novamente');
			}
			redirect(303, '/');
		}
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const formLogin = await superValidate(formData, zod(schemaLogin));
		if (!formLogin.valid) {
			return setError(formLogin, 'error de validação');
		}
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);

			return setError(formLogin, 'email ou senha estão errados... tente novamente!');
		} else {
			redirect(303, '/pv');
		}
	}
};
