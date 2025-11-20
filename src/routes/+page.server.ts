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

const schemaContact = z.object({
	name: z.string().min(3, { message: 'Nome deve ter 3 caracteres no mínimo.' }),
	email: z.string().email('Email inválido.'),
	phone: z.string().optional(),
	subject: z.string().min(5, { message: 'Assunto deve ter pelo menos 5 caracteres.' }),
	message: z.string().min(10, { message: 'Mensagem deve ter pelo menos 10 caracteres.' })
});

const schemaResetPassword = z.object({
	email: z.string().email('Email inválido.')
});

export const load: PageServerLoad = async () => {
	const formLogin = await superValidate(zod(schemaLogin));
	const formSignup = await superValidate(zod(schemaSignup));
	const formResetPassword = await superValidate(zod(schemaResetPassword));
	return { formLogin, formSignup, formResetPassword };
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
		const type = formData.get('radio') === 'Prestador' ? 1 : 2; // 1 = Prestador, 2 = Cliente
		const typePersonal = formData.get('typePersonal') as string;
		const phone = formData.get('phone') as string;
		const name = formData.get('name') as string;
		const date = formData.get('date') as string;

		// Criar usuário no Supabase Auth
		const { data: authData, error: authError } = await supabase.auth.signUp({ 
			email, 
			password,
			options: {
				emailRedirectTo: `${request.url.split('?')[0]}`
			}
		});
		
		if (authError) {
			console.error('Erro ao criar usuário:', authError);
			return setError(formSignup, 'não foi possivel realizar o cadastro... tente novamente');
		}
		
		if (!authData.user) {
			return setError(formSignup, 'erro ao criar usuário');
		}
		
		// Fazer login automaticamente após o cadastro
		const { error: signInError } = await supabase.auth.signInWithPassword({ 
			email, 
			password 
		});
		
		if (signInError) {
			console.error('Erro ao fazer login após cadastro:', signInError);
			return setError(formSignup, 'usuário criado, mas não foi possível fazer login automático');
		}
		
		// Inserir perfil do usuário
		const { error: profileError } = await supabase.from('profile').insert([
			{
				id_auth: authData.user.id,
				type: type,
				name: name,
				typePersonal: typePersonal,
				phone: phone,
				date: date
			}
		]);
		
		if (profileError) {
			console.error('Erro ao criar perfil:', profileError);
			return setError(formSignup, 'não foi possivel criar o perfil... tente novamente');
		}
		
		// Redirecionar para a área privada
		redirect(303, '/pv');
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
	},
	sendContact: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const formContact = await superValidate(formData, zod(schemaContact));
		
		if (!formContact.valid) {
			return setError(formContact, 'Erro de validação. Verifique os campos.');
		}

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const phone = formData.get('phone') as string;
		const subject = formData.get('subject') as string;
		const message = formData.get('message') as string;

		try {
			// Inserir mensagem no banco de dados
			const { error: dbError } = await supabase.from('contact_messages').insert([
				{
					id_user: user?.id || null,
					name: name,
					email: email,
					phone: phone || null,
					subject: subject,
					message: message,
					status: 'pendente'
				}
			]);

			if (dbError) {
				console.error('Erro ao salvar mensagem:', dbError);
				return setError(formContact, 'Erro ao salvar mensagem. Tente novamente.');
			}

			// Aqui você pode adicionar a lógica de envio de email
			// Por exemplo, usando um serviço como Resend, SendGrid, etc.
			// await sendEmail({
			//   to: 'suporte.techfind@outlook.com',
			//   subject: `Contato: ${subject}`,
			//   text: `Nome: ${name}\nEmail: ${email}\nTelefone: ${phone}\n\nMensagem:\n${message}`
			// });

			return { formContact, success: true };
		} catch (error) {
			console.error('Erro ao processar contato:', error);
			return setError(formContact, 'Erro ao processar sua solicitação.');
		}
	},
	resetPassword: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const formResetPassword = await superValidate(formData, zod(schemaResetPassword));

		if (!formResetPassword.valid) {
			return setError(formResetPassword, 'Email inválido.');
		}

		const email = formData.get('email') as string;

		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${new URL(request.url).origin}/auth/reset-password`
			});

			if (error) {
				console.error('Erro ao enviar email de recuperação:', error);
				return setError(formResetPassword, 'Erro ao enviar email. Tente novamente.');
			}

			return { formResetPassword, success: true, message: 'Email de recuperação enviado! Verifique sua caixa de entrada.' };
		} catch (error) {
			console.error('Erro ao processar recuperação:', error);
			return setError(formResetPassword, 'Erro ao processar sua solicitação.');
		}
	}
};
