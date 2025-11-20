<script lang="ts">
	import { X, Send, Mail, Phone, User, MessageSquare } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
		userEmail?: string;
		userName?: string;
	}

	let { isOpen = $bindable(false), onClose, userEmail = '', userName = '' }: Props = $props();

	let formData = $state({
		name: userName,
		email: userEmail,
		phone: '',
		subject: '',
		message: ''
	});

	let isSubmitting = $state(false);
	let submitStatus: 'idle' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');

	// Resetar formulário quando o modal abrir
	$effect(() => {
		if (isOpen) {
			formData.name = userName;
			formData.email = userEmail;
			submitStatus = 'idle';
			errorMessage = '';
		}
	});

	function handleClose() {
		if (onClose) {
			onClose();
		}
		isOpen = false;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		submitStatus = 'idle';
		errorMessage = '';

		try {
			const response = await fetch('/?/sendContact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					subject: formData.subject,
					message: formData.message
				})
			});

			if (response.ok) {
				submitStatus = 'success';
				// Limpar formulário após sucesso
				formData = {
					name: userName,
					email: userEmail,
					phone: '',
					subject: '',
					message: ''
				};
				// Fechar modal após 2 segundos
				setTimeout(() => {
					handleClose();
				}, 2000);
			} else {
				submitStatus = 'error';
				errorMessage = 'Erro ao enviar mensagem. Tente novamente.';
			}
		} catch (error) {
			console.error('Erro ao enviar contato:', error);
			submitStatus = 'error';
			errorMessage = 'Erro ao enviar mensagem. Verifique sua conexão.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={(e) => {
			if (e.target === e.currentTarget) handleClose();
		}}
		role="dialog"
		aria-modal="true"
		aria-labelledby="contact-modal-title"
		tabindex="-1"
	>
		<div
			class="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl"
			transition:fly={{ y: 20, duration: 300 }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-principal-4 to-principal-5 p-6">
				<div class="flex items-center gap-3">
					<div class="rounded-full bg-white/20 p-2">
						<Mail size={24} class="text-white" />
					</div>
					<div>
						<h2 id="contact-modal-title" class="text-2xl font-bold !text-white">
							Entre em Contato
						</h2>
						<p class="text-sm font-medium !text-white/90">
							Envie sua mensagem e retornaremos em breve
						</p>
					</div>
				</div>
				<button
					type="button"
					onclick={handleClose}
					class="rounded-full bg-white/20 p-2 text-white transition-all duration-200 hover:bg-white/30"
					aria-label="Fechar modal"
				>
					<X size={24} />
				</button>
			</div>

			<!-- Body -->
			<div class="max-h-[70vh] overflow-y-auto p-6">
				{#if submitStatus === 'success'}
					<div
						class="rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-500 p-6 text-center"
						transition:fade
					>
						<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
							<Send size={32} class="text-white" />
						</div>
						<h3 class="mb-2 text-xl font-bold text-green-800 dark:text-green-300">
							Mensagem enviada com sucesso!
						</h3>
						<p class="font-medium text-green-700 dark:text-green-400">
							Entraremos em contato em breve através do email fornecido.
						</p>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-4">
						<!-- Nome -->
						<div>
							<label for="contact-name" class="mb-2 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
								<User size={18} class="text-principal-4" />
								Nome Completo
							</label>
							<input
								type="text"
								id="contact-name"
								bind:value={formData.name}
								required
								placeholder="Seu nome completo"
								class="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-principal-4 focus:outline-none focus:ring-2 focus:ring-principal-4/20"
							/>
						</div>

						<!-- Email -->
						<div>
							<label for="contact-email" class="mb-2 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
								<Mail size={18} class="text-principal-4" />
								Email
							</label>
							<input
								type="email"
								id="contact-email"
								bind:value={formData.email}
								required
								placeholder="seu.email@exemplo.com"
								class="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-principal-4 focus:outline-none focus:ring-2 focus:ring-principal-4/20"
							/>
						</div>

						<!-- Telefone (opcional) -->
						<div>
							<label for="contact-phone" class="mb-2 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
								<Phone size={18} class="text-principal-4" />
								Telefone <span class="text-sm font-normal text-gray-500 dark:text-gray-400">(opcional)</span>
							</label>
							<input
								type="tel"
								id="contact-phone"
								bind:value={formData.phone}
								placeholder="(00) 00000-0000"
								class="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-principal-4 focus:outline-none focus:ring-2 focus:ring-principal-4/20"
							/>
						</div>

						<!-- Assunto -->
						<div>
							<label for="contact-subject" class="mb-2 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
								<MessageSquare size={18} class="text-principal-4" />
								Assunto
							</label>
							<input
								type="text"
								id="contact-subject"
								bind:value={formData.subject}
								required
								placeholder="Sobre o que você gostaria de falar?"
								class="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-principal-4 focus:outline-none focus:ring-2 focus:ring-principal-4/20"
							/>
						</div>

						<!-- Mensagem -->
						<div>
							<label for="contact-message" class="mb-2 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
								<MessageSquare size={18} class="text-principal-4" />
								Mensagem
							</label>
							<textarea
								id="contact-message"
								bind:value={formData.message}
								required
								rows="5"
								placeholder="Descreva sua dúvida ou solicitação..."
								class="w-full resize-none rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-principal-4 focus:outline-none focus:ring-2 focus:ring-principal-4/20"
							></textarea>
						</div>

						<!-- Error Message -->
						{#if submitStatus === 'error'}
							<div
								class="rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-500 p-4"
								transition:fade
							>
								<p class="font-bold text-red-700 dark:text-red-300">{errorMessage}</p>
							</div>
						{/if}

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={isSubmitting}
							class="flex w-full items-center justify-center gap-2 rounded-lg bg-principal-4 dark:bg-principal-5 px-6 py-3 font-bold !text-gray-900 dark:!text-white shadow-lg shadow-principal-4/30 transition-all duration-300 hover:bg-principal-5 dark:hover:bg-principal-6 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isSubmitting}
								<div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
								Enviando...
							{:else}
								<Send size={20} />
								Enviar Mensagem
							{/if}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}
