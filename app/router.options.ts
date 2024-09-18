// @ts-nocheck
import type {RouterConfig} from '@nuxt/schema'

export default {
    // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
    routes: (_routes) => [
        {
            name: 'home',
            path: '/',
            component: () => import('@/pages/index.vue')
        },
        {
            name: 'collections',
            path: '/collections',
            component: () => import('@/pages/collections.vue')
        },
        {
            name: 'collection',
            path: '/collection/:collection',
            component: () => import('@/pages/collection/collection.vue')
        },
        {
            name: 'about',
            path: '/about',
            component: () => import('@/pages/about.vue')
        },
        {
            name: 'imageview',
            path: '/view/:remotePath(.*)',
            component: () => import('~/pages/view/view.vue')
        }
    ],
} satisfies RouterConfig