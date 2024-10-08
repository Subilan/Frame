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

    modules: ['@nuxt/image'],

    vite: {
        plugins: [
            svgLoader()
        ]
    },

    plugins: [
        {
            src: '@/plugins/openlayer',
            mode: 'client'
        }
    ]
})
