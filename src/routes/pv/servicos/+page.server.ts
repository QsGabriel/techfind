import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	titulo: z.string().min(1, { message: 'Título é obrigatório.' }),
	descricao: z.string().min(1, { message: 'Descrição é obrigatório.' }),
	preco: z.number().positive('Preço é positivo')
});

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	if (user) {
		const form = await superValidate(zod(schema));
		const { data: services } = await supabase.from('services').select().eq('id_user', user.id);
		return { services: services, form: form };
	}
	return null;
};

export const actions: Actions = {
	insertService: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(schema));
		if (!form.valid) {
			return setError(form, 'error de validação servico');
		}
		if (user) {
			const titulo = formData.get('titulo') as string;
			const descricao = formData.get('descricao') as string;
			const preco = formData.get('preco') as string;
			const data = new Date();
			try {
				await supabase.from('services').insert({
					criado_em: data,
					titulo: titulo,
					descricao: descricao,
					preco: preco,
					id_user: user.id
				});
			} catch (error) {
				console.error(error);
				setError(form, 'error ao cadastrar o servico.');
			}
			redirect(303, '/pv/servicos');
		}
	},
	deleteService: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('servicoId') as string;
		try {
			await supabase.from('services').delete().eq('id', id);
		} catch (error) {
			console.error(error);
		}
		redirect(303, '/pv/servicos');
	}
};
