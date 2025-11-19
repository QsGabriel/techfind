/**
 * @file accessibility.js
 * @description Store centralizado para gerenciar configurações de acessibilidade
 * Inclui: tema (claro/escuro), tamanho de fonte, alto contraste
 * Persistência via localStorage com fallback seguro
 */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// ============================================
// CONSTANTES
// ============================================
const STORAGE_KEYS = {
	THEME: 'techfind-theme',
	FONT_SIZE: 'techfind-font-size',
	HIGH_CONTRAST: 'techfind-high-contrast'
};

const THEMES = {
	LIGHT: 'light',
	DARK: 'dark',
	AUTO: 'auto'
};

const FONT_SIZES = {
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large',
	EXTRA_LARGE: 'extra-large'
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Obtém preferência do tema do sistema operacional
 * @returns {string} 'light' ou 'dark'
 */
function getSystemTheme() {
	if (!browser) return THEMES.LIGHT;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
}

/**
 * Lê valor do localStorage com validação
 * @param {string} key - Chave do localStorage
 * @param {*} defaultValue - Valor padrão caso não exista
 * @returns {*} Valor do localStorage ou padrão
 */
function getStorageValue(key, defaultValue) {
	if (!browser) return defaultValue;

	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (error) {
		console.warn(`[Accessibility] Erro ao ler ${key}:`, error);
		return defaultValue;
	}
}

/**
 * Salva valor no localStorage com validação
 * @param {string} key - Chave do localStorage
 * @param {*} value - Valor a ser salvo
 */
function setStorageValue(key, value) {
	if (!browser) return;

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(`[Accessibility] Erro ao salvar ${key}:`, error);
	}
}

/**
 * Aplica atributos no elemento HTML
 * @param {string} attribute - Nome do atributo
 * @param {string | null} value - Valor do atributo
 */
function applyToHTML(attribute, value) {
	if (!browser) return;

	const html = document.documentElement;
	if (value) {
		html.setAttribute(attribute, value);
	} else {
		html.removeAttribute(attribute);
	}
}

// ============================================
// STORES
// ============================================

/**
 * Store do tema: 'light', 'dark', ou 'auto'
 */
function createThemeStore() {
	const initialTheme = getStorageValue(STORAGE_KEYS.THEME, THEMES.AUTO);
	const { subscribe, set, update } = writable(initialTheme);

	return {
		subscribe,
		set: (/** @type {any} */ value) => {
			set(value);
			setStorageValue(STORAGE_KEYS.THEME, value);
			applyTheme(value);
		},
		toggle: () => {
			update((current) => {
				const newTheme = current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
				setStorageValue(STORAGE_KEYS.THEME, newTheme);
				applyTheme(newTheme);
				return newTheme;
			});
		},
		setLight: () => {
			set(THEMES.LIGHT);
			setStorageValue(STORAGE_KEYS.THEME, THEMES.LIGHT);
			applyTheme(THEMES.LIGHT);
		},
		setDark: () => {
			set(THEMES.DARK);
			setStorageValue(STORAGE_KEYS.THEME, THEMES.DARK);
			applyTheme(THEMES.DARK);
		},
		setAuto: () => {
			set(THEMES.AUTO);
			setStorageValue(STORAGE_KEYS.THEME, THEMES.AUTO);
			applyTheme(THEMES.AUTO);
		}
	};
}

/**
 * Aplica o tema no documento
 * @param {string} theme - Tema a ser aplicado
 */
function applyTheme(theme) {
	if (!browser) return;

	const effectiveTheme = theme === THEMES.AUTO ? getSystemTheme() : theme;
	applyToHTML('data-theme', effectiveTheme);

	// Adiciona classe no body para compatibilidade com Tailwind
	document.body.classList.remove('light', 'dark');
	document.body.classList.add(effectiveTheme);
}

/**
 * Store do tamanho de fonte
 */
function createFontSizeStore() {
	const initialSize = getStorageValue(STORAGE_KEYS.FONT_SIZE, FONT_SIZES.MEDIUM);
	const { subscribe, set, update } = writable(initialSize);

	return {
		subscribe,
		set: (/** @type {any} */ value) => {
			set(value);
			setStorageValue(STORAGE_KEYS.FONT_SIZE, value);
			applyToHTML('data-font-size', value);
		},
		increase: () => {
			update((current) => {
				const sizes = Object.values(FONT_SIZES);
				const currentIndex = sizes.indexOf(current);
				if (currentIndex < sizes.length - 1) {
					const newSize = sizes[currentIndex + 1];
					setStorageValue(STORAGE_KEYS.FONT_SIZE, newSize);
					applyToHTML('data-font-size', newSize);
					return newSize;
				}
				return current;
			});
		},
		decrease: () => {
			update((current) => {
				const sizes = Object.values(FONT_SIZES);
				const currentIndex = sizes.indexOf(current);
				if (currentIndex > 0) {
					const newSize = sizes[currentIndex - 1];
					setStorageValue(STORAGE_KEYS.FONT_SIZE, newSize);
					applyToHTML('data-font-size', newSize);
					return newSize;
				}
				return current;
			});
		},
		reset: () => {
			set(FONT_SIZES.MEDIUM);
			setStorageValue(STORAGE_KEYS.FONT_SIZE, FONT_SIZES.MEDIUM);
			applyToHTML('data-font-size', FONT_SIZES.MEDIUM);
		}
	};
}

/**
 * Store de alto contraste
 */
function createHighContrastStore() {
	const initialValue = getStorageValue(STORAGE_KEYS.HIGH_CONTRAST, false);
	const { subscribe, set, update } = writable(initialValue);

	return {
		subscribe,
		set: (/** @type {any} */ value) => {
			set(value);
			setStorageValue(STORAGE_KEYS.HIGH_CONTRAST, value);
			applyToHTML('data-high-contrast', value ? 'true' : null);
		},
		toggle: () => {
			update((current) => {
				const newValue = !current;
				setStorageValue(STORAGE_KEYS.HIGH_CONTRAST, newValue);
				applyToHTML('data-high-contrast', newValue ? 'true' : null);
				return newValue;
			});
		}
	};
}

// ============================================
// EXPORTAÇÕES
// ============================================

export const theme = createThemeStore();
export const fontSize = createFontSizeStore();
export const highContrast = createHighContrastStore();

/**
 * Derived store que retorna o tema efetivo (resolve 'auto')
 */
export const effectiveTheme = derived(theme, ($theme) => {
	if ($theme === THEMES.AUTO) {
		return getSystemTheme();
	}
	return $theme;
});

/**
 * Inicializa as configurações de acessibilidade
 * Deve ser chamado no layout principal
 */
export function initializeAccessibility() {
	if (!browser) return;

	// Aplica configurações salvas
	const savedTheme = getStorageValue(STORAGE_KEYS.THEME, THEMES.AUTO);
	const savedFontSize = getStorageValue(STORAGE_KEYS.FONT_SIZE, FONT_SIZES.MEDIUM);
	const savedHighContrast = getStorageValue(STORAGE_KEYS.HIGH_CONTRAST, false);

	applyTheme(savedTheme);
	applyToHTML('data-font-size', savedFontSize);
	applyToHTML('data-high-contrast', savedHighContrast ? 'true' : null);

	// Listener para mudanças no tema do sistema
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const handleSystemThemeChange = (/** @type {any} */ e) => {
		const currentTheme = getStorageValue(STORAGE_KEYS.THEME, THEMES.AUTO);
		if (currentTheme === THEMES.AUTO) {
			applyTheme(THEMES.AUTO);
		}
	};

	// Suporte para diferentes navegadores
	if (mediaQuery.addEventListener) {
		mediaQuery.addEventListener('change', handleSystemThemeChange);
	} else {
		// Fallback para navegadores antigos
		mediaQuery.addListener(handleSystemThemeChange);
	}
}

// Exporta constantes para uso nos componentes
export { THEMES, FONT_SIZES, STORAGE_KEYS };
