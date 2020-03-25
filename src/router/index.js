import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'Home',
            redirect: '/home/processingcenter',
            component: () => import("@/components/Home.vue"),
            children: [
                {
                    path: 'processingcenter',
                    name: 'ProcessingCenter',
                    component: () => import("@/components/ProcessingCenter.vue")
                }, {
                    path: 'workbench',
                    name: 'WorkBench',
                    component: () => import("@/components/WorkBench.vue")
                }, {
                    path: 'product',
                    name: 'Product',
                    redirect: 'product/categorys',
                    component: () => import("@/components/Product.vue"),
                    children: [
                        {
                            path: 'goods/:categoryType',
                            name: 'Goods',
                            component: () => import("@/components/Product/Goods.vue"),
                            props: true
                        }, {
                            path: 'categorys',
                            name: 'Categorys',
                            component: () => import("@/components/Product/Categorys.vue")
                        },
                    ]
                }, {
                    path: 'order',
                    name: 'Order',
                    component: () => import("@/components/Order.vue")
                },
            ]
        }, {
            path: '/login',
            name: 'Login',
            component: () => import("@/components/Login.vue")
        }, {
            path: '/404',
            name: 'NonFound',
            component: () => import("@/components/NonFound.vue")
        }, {
            path: '*',
            redirect: '/404',
        },
    ]
})
