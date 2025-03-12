import svgLoader from 'vite-svg-loader';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',

	devtools: {
		enabled: false
	},

	devServer: {
		port: 7070
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
			link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
		},
	},

	$production: {
		nitro: {
			preset: 'vercel'
		}
	}
});
