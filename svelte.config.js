import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),

	kit: {
		alias: {
			$img: 'src/lib/images'
		},
		adapter: adapter()
	}
};

export default config;
