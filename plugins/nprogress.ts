import NProgress from 'nprogress';

NProgress.configure({
    showSpinner: false,
    speed: 200,
    easing: 'cubic-bezier(0.65, 0, 0.35, 1)'
});

export default defineNuxtPlugin((nuxtApp) => {
    useRouter().beforeEach(() => {
        NProgress.start()
    });

    useRouter().afterEach(() => {
        NProgress.done();
    })
})
