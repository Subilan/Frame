import svgLoader from 'vite-svg-loader';

// https://nuxt.com/docs/api/configuration/nuxt-config

const port = 7070;

export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',

	devtools: {
		enabled: false
	},

	devServer: {
		port
	},

	modules: ['@nuxt/image', 'nuxt-route-meta'],

	vite: {
		plugins: [svgLoader()],
		css: {
			preprocessorOptions: {
				sass: {
					api: 'modern'
				},
				scss: {
					api: 'modern'
				}
			}
		}
	},

	plugins: [
		{
			src: '@/plugins/openlayer',
			mode: 'client'
		}
	],

	app: {
		head: {
			link: [
				{ rel: 'icon', type: 'image/png', href: '/favicon.png' },
				{ rel: 'stylesheet', href: '/fonts/fira-sans/font.css' },
				{ rel: 'stylesheet', href: '/fonts/open-sans/font.css' }
			]
		}
	},

	nitro: {
		srcDir: 'server'
	}
});
