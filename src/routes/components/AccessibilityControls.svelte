<script>
	/**
	 * @component AccessibilityControls
	 * @description Painel flutuante de controles de acessibilidade
	 * Inclui: alternância de tema, controle de fonte, alto contraste
	 */
	import { theme, fontSize, highContrast, effectiveTheme, THEMES } from '$stores/accessibility.js';
	import {
		Sun,
		Moon,
		Monitor,
		Type,
		Contrast,
		Settings,
		X,
		Plus,
		Minus,
		RotateCcw
	} from '@lucide/svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	// Estado do painel
	let isOpen = $state(false);
	let isExpanded = $state(false);
	let isVisible = $state(true);

	// Stores reativas
	let currentTheme = $state($theme);
	let currentFontSize = $state($fontSize);
	let currentHighContrast = $state($highContrast);
	let currentEffectiveTheme = $state($effectiveTheme);

	// Subscrições
	$effect(() => {
		currentTheme = $theme;
	});

	$effect(() => {
		currentFontSize = $fontSize;
	});

	$effect(() => {
		currentHighContrast = $highContrast;
	});

	$effect(() => {
		currentEffectiveTheme = $effectiveTheme;
	});

	// Controle de visibilidade baseado no scroll
	onMount(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			
			// Oculta o botão quando estiver próximo do footer (últimos 300px)
			const isNearFooter = scrollPosition + windowHeight >= documentHeight - 300;
			
			isVisible = !isNearFooter;
		};

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleScroll);
		handleScroll(); // Verifica a posição inicial

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	});

	// Funções de controle
	function togglePanel() {
		isOpen = !isOpen;
		if (!isOpen) {
			isExpanded = false;
		}
	}

	function closePanel() {
		isOpen = false;
		isExpanded = false;
	}

	// Atalhos de teclado
	function handleKeydown(event) {
		// ESC para fechar
		if (event.key === 'Escape' && isOpen) {
			closePanel();
		}
		// Ctrl + Shift + A para abrir/fechar
		if (event.ctrlKey && event.shiftKey && event.key === 'A') {
			event.preventDefault();
			togglePanel();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Botão Flutuante Principal -->
{#if isVisible}
	<div class="accessibility-widget" transition:scale={{ duration: 300 }}>
		<button
			class="accessibility-trigger"
			onclick={togglePanel}
			aria-label="Abrir controles de acessibilidade"
			aria-expanded={isOpen}
			aria-controls="accessibility-panel"
			title="Controles de Acessibilidade (Ctrl+Shift+A)"
		>
			<Settings class="icon" />
			<span class="sr-only">Acessibilidade</span>
	</button>

	<!-- Painel de Controles -->
	{#if isOpen}
		<div
			id="accessibility-panel"
			class="accessibility-panel"
			role="dialog"
			aria-label="Painel de Acessibilidade"
			transition:fly={{ y: 20, duration: 300, easing: quintOut }}
		>
			<!-- Header -->
			<div class="panel-header">
				<h2 class="panel-title">
					<Settings class="icon-small" />
					Acessibilidade
				</h2>
				<button
					class="close-button"
					onclick={closePanel}
					aria-label="Fechar painel de acessibilidade"
				>
					<X class="icon-small" />
				</button>
			</div>

			<!-- Conteúdo -->
			<div class="panel-content">
				<!-- Seção: Tema -->
				<section class="control-section">
					<h3 class="section-title">
						{#if currentEffectiveTheme === 'dark'}
							<Moon class="icon-small" />
						{:else}
							<Sun class="icon-small" />
						{/if}
						Tema
					</h3>
					<div class="button-group" role="group" aria-label="Seleção de tema">
						<button
							class="control-button {currentTheme === THEMES.LIGHT ? 'active' : ''}"
							onclick={() => theme.setLight()}
							aria-label="Ativar tema claro"
							aria-pressed={currentTheme === THEMES.LIGHT}
						>
							<Sun class="icon-small" />
							<span>Claro</span>
						</button>
						<button
							class="control-button {currentTheme === THEMES.DARK ? 'active' : ''}"
							onclick={() => theme.setDark()}
							aria-label="Ativar tema escuro"
							aria-pressed={currentTheme === THEMES.DARK}
						>
							<Moon class="icon-small" />
							<span>Escuro</span>
						</button>
						<button
							class="control-button {currentTheme === THEMES.AUTO ? 'active' : ''}"
							onclick={() => theme.setAuto()}
							aria-label="Usar tema do sistema"
							aria-pressed={currentTheme === THEMES.AUTO}
						>
							<Monitor class="icon-small" />
							<span>Auto</span>
						</button>
					</div>
				</section>

				<!-- Seção: Tamanho de Fonte -->
				<section class="control-section">
					<h3 class="section-title">
						<Type class="icon-small" />
						Tamanho da Fonte
					</h3>
					<div class="button-group" role="group" aria-label="Controle de tamanho de fonte">
						<button
							class="control-button"
							onclick={() => fontSize.decrease()}
							aria-label="Diminuir tamanho da fonte"
							disabled={currentFontSize === 'small'}
						>
							<Minus class="icon-small" />
							<span>A-</span>
						</button>
						<button
							class="control-button"
							onclick={() => fontSize.reset()}
							aria-label="Resetar tamanho da fonte"
						>
							<RotateCcw class="icon-small" />
							<span>Reset</span>
						</button>
						<button
							class="control-button"
							onclick={() => fontSize.increase()}
							aria-label="Aumentar tamanho da fonte"
							disabled={currentFontSize === 'extra-large'}
						>
							<Plus class="icon-small" />
							<span>A+</span>
						</button>
					</div>
					<div class="font-size-indicator" aria-live="polite">
						Tamanho atual:
						<strong>
							{#if currentFontSize === 'small'}Pequeno
							{:else if currentFontSize === 'medium'}Médio
							{:else if currentFontSize === 'large'}Grande
							{:else}Extra Grande{/if}
						</strong>
					</div>
				</section>

				<!-- Seção: Alto Contraste -->
				<section class="control-section">
					<h3 class="section-title">
						<Contrast class="icon-small" />
						Alto Contraste
					</h3>
					<div class="toggle-container">
						<button
							class="toggle-button {currentHighContrast ? 'active' : ''}"
							onclick={() => highContrast.toggle()}
							role="switch"
							aria-checked={currentHighContrast}
							aria-label="Alternar alto contraste"
						>
							<span class="toggle-slider"></span>
							<span class="toggle-label">
								{currentHighContrast ? 'Ativado' : 'Desativado'}
							</span>
						</button>
						<p class="helper-text">Ideal para daltonismo e baixa visão</p>
					</div>
				</section>

				<!-- Atalhos de Teclado -->
				<section class="control-section keyboard-shortcuts">
					<h3 class="section-title">⌨️ Atalhos de Teclado</h3>
					<ul class="shortcuts-list">
						<li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> - Abrir/Fechar painel</li>
						<li><kbd>ESC</kbd> - Fechar painel</li>
						<li><kbd>Tab</kbd> - Navegar entre controles</li>
					</ul>
				</section>
			</div>

			<!-- Footer -->
			<div class="panel-footer">
				<p class="footer-text">
					💡 As configurações são salvas automaticamente
				</p>
			</div>
		</div>

		<!-- Overlay -->
		<button
			class="accessibility-overlay"
			onclick={closePanel}
			aria-label="Fechar painel de acessibilidade"
			transition:fade={{ duration: 200 }}
		></button>
	{/if}
	</div>
{/if}

<style>
	/* ============================================
	   BOTÃO FLUTUANTE PRINCIPAL
	   ============================================ */
	.accessibility-widget {
		position: fixed;
		bottom: 24px;
		left: 24px; /* Alterado de right para left */
		z-index: 10000; /* Acima do painel */
	}

	.accessibility-trigger {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--primary-color, #4f46e5);
		color: white;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 4px 6px rgba(0, 0, 0, 0.1),
			0 2px 4px rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;
		position: relative;
	}

	.accessibility-trigger:hover {
		transform: scale(1.1);
		box-shadow:
			0 10px 15px rgba(0, 0, 0, 0.2),
			0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.accessibility-trigger:focus-visible {
		outline: 3px solid var(--focus-ring, #4f46e5);
		outline-offset: 3px;
	}

	.accessibility-trigger .icon {
		width: 24px;
		height: 24px;
		animation: spin 10s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.accessibility-trigger:hover .icon {
		animation-duration: 2s;
	}

	/* ============================================
	   PAINEL DE CONTROLES
	   ============================================ */
	.accessibility-panel {
		position: fixed;
		bottom: 96px;
		left: 24px; /* Alterado de right para left */
		width: 380px;
		max-width: calc(100vw - 48px);
		max-height: calc(100vh - 120px);
		background: var(--bg-color, white);
		border-radius: 16px;
		box-shadow:
			0 20px 25px rgba(0, 0, 0, 0.1),
			0 10px 10px rgba(0, 0, 0, 0.04);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
		z-index: 9999; /* Acima do overlay */
	}

	/* Header */
	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
		background: var(--header-bg, rgba(79, 70, 229, 0.05));
	}

	.panel-title {
		font-size: 18px;
		font-weight: 600;
		color: var(--text-color, #1f2937);
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
	}

	.close-button {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		border: none;
		background: transparent;
		color: var(--text-color, #6b7280);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.close-button:hover {
		background: var(--hover-bg, rgba(0, 0, 0, 0.05));
		color: var(--text-color, #1f2937);
	}

	.close-button:focus-visible {
		outline: 2px solid var(--focus-ring, #4f46e5);
		outline-offset: 2px;
	}

	/* Content */
	.panel-content {
		padding: 20px;
		overflow-y: auto;
		flex: 1;
	}

	.control-section {
		margin-bottom: 24px;
	}

	.control-section:last-child {
		margin-bottom: 0;
	}

	.section-title {
		font-size: 14px;
		font-weight: 600;
		color: var(--text-color, #374151);
		margin: 0 0 12px 0;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* Botões */
	.button-group {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.control-button {
		flex: 1;
		min-width: 80px;
		padding: 10px 12px;
		border-radius: 8px;
		border: 2px solid var(--border-color, #e5e7eb);
		background: var(--bg-color, white);
		color: var(--text-color, #374151);
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		transition: all 0.2s;
	}

	.control-button:hover:not(:disabled) {
		border-color: var(--primary-color, #4f46e5);
		background: var(--hover-bg, rgba(79, 70, 229, 0.05));
	}

	.control-button:focus-visible {
		outline: 2px solid var(--focus-ring, #4f46e5);
		outline-offset: 2px;
	}

	.control-button.active {
		border-color: var(--primary-color, #4f46e5);
		background: var(--primary-color, #4f46e5);
		color: white;
		font-weight: 600; /* Garantir contraste */
	}

	.control-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Toggle */
	.toggle-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.toggle-button {
		width: 100%;
		padding: 12px 16px;
		border-radius: 8px;
		border: 2px solid var(--border-color, #e5e7eb);
		background: var(--bg-color, white);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 12px;
		transition: all 0.2s;
		position: relative;
	}

	.toggle-button:hover {
		border-color: var(--primary-color, #4f46e5);
	}

	.toggle-button:focus-visible {
		outline: 2px solid var(--focus-ring, #4f46e5);
		outline-offset: 2px;
	}

	.toggle-button.active {
		background: rgba(79, 70, 229, 0.1);
		border-color: var(--primary-color, #4f46e5);
	}

	.toggle-slider {
		width: 48px;
		height: 24px;
		border-radius: 12px;
		background: var(--border-color, #d1d5db);
		position: relative;
		transition: all 0.3s;
	}

	.toggle-button.active .toggle-slider {
		background: var(--primary-color, #4f46e5);
	}

	.toggle-slider::after {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: white;
		top: 2px;
		left: 2px;
		transition: all 0.3s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-button.active .toggle-slider::after {
		transform: translateX(24px);
	}

	.toggle-label {
		font-size: 14px;
		font-weight: 500;
		color: var(--text-color, #374151);
	}

	/* Helper Text */
	.helper-text,
	.font-size-indicator {
		font-size: 12px;
		color: var(--text-secondary, #6b7280);
		margin: 0;
	}

	.font-size-indicator {
		text-align: center;
		margin-top: 8px;
	}

	/* Atalhos de Teclado */
	.keyboard-shortcuts {
		background: var(--hover-bg, rgba(0, 0, 0, 0.02));
		padding: 12px;
		border-radius: 8px;
	}

	.shortcuts-list {
		list-style: none;
		padding: 0;
		margin: 8px 0 0 0;
		font-size: 12px;
		color: var(--text-secondary, #6b7280);
	}

	.shortcuts-list li {
		margin-bottom: 4px;
	}

	kbd {
		display: inline-block;
		padding: 2px 6px;
		font-size: 11px;
		font-family: monospace;
		background: var(--kbd-bg, #f3f4f6);
		border: 1px solid var(--border-color, #d1d5db);
		border-radius: 4px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	/* Footer */
	.panel-footer {
		padding: 12px 20px;
		border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
		background: var(--footer-bg, rgba(0, 0, 0, 0.02));
	}

	.footer-text {
		font-size: 12px;
		color: var(--text-secondary, #6b7280);
		margin: 0;
		text-align: center;
	}

	/* Overlay */
	.accessibility-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 9998;
		border: none;
		cursor: pointer;
	}

	/* Ícones */
	.icon {
		width: 24px;
		height: 24px;
	}

	.icon-small {
		width: 18px;
		height: 18px;
	}

	/* Screen Reader Only */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	/* Responsivo */
	@media (max-width: 480px) {
		.accessibility-widget {
			bottom: 16px;
			left: 16px; /* Alterado de right para left */
		}

		.accessibility-panel {
			bottom: 80px;
			left: 16px; /* Alterado de right para left */
			width: calc(100vw - 32px);
		}

		.control-button {
			min-width: 60px;
			font-size: 13px;
		}
	}
</style>
