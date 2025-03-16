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
            component: () => import('@/pages/collection.vue')
        },
        {
            name: 'about',
            path: '/about',
            component: () => import('@/pages/about.vue')
        },
        {
            name: 'imageview',
            path: '/view/:collectionName/:filename',
            component: () => import('@/pages/view.vue')
        },
        {
            name: 'categories',
            path: '/categories',
            component: () => import('@/pages/categories.vue')
        },
        {
            name: 'category',
            path: '/category/:categoryType/:categoryName',
            component: () => import('@/pages/category.vue')
        }
    ],
} satisfies RouterConfig