// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'normalize.css/normalize.css';
import 'styles/index.scss';
import 'components/Icon-svg/index';
import 'assets/iconfont/iconfont';
import * as filters from './filters';
import vueWaves from './directive/waves';
import './mock/index.js';  //使用api请求时请将此行注释，不然将被mock拦截

// register globally
Vue.use(ElementUI);
Vue.use(vueWaves);


// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

function hasPermission(roles, permissionRoles) {
    if (roles.indexOf('admin') >= 0) return true;
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
// register global progress.
const whiteList = ['/login', '/authredirect'];// 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (store.getters.token) {
        if (to.path === '/login') {
            next({path: '/'});
        } else {
            if (to.meta && to.meta.role) {
                if (hasPermission(store.getters.roles, to.meta.role)) {
                    next();
                } else {
                    next('/401');
                }
            } else {
                next();
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
