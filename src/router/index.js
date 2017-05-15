import Vue from 'vue';
import Router from 'vue-router';

/* layout*/
import Layout from '../views/layout/Layout';

// dashboard
const dashboard = resolve => require(['../views/dashboard/index'], resolve);

/* error page*/
const Err404 = resolve => require(['../views/error/404'], resolve);
const Err401 = resolve => require(['../views/error/401'], resolve);

/* login*/
import Login from '../views/login/';
import authRedirect from '../views/login/authredirect';

// 物品管理
const GoodsManagement = resolve => require(['../views/goodsManagement/goodsManagement'], resolve);

// 归还管理
const ReturnManagement = resolve => require(['../views/returnManagement/returnManagement'], resolve);

// 统计
const Statistic = resolve => require(['../views/statistic/statistic'], resolve);

// 管理员帐号管理
const AccountManagement = resolve => require(['../views/accountManagement/accountManagement'], resolve);


Vue.use(Router);

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: [
        {path: '/login', component: Login, hidden: true},
        {path: '/authredirect', component: authRedirect, hidden: true},
        {path: '/404', component: Err404, hidden: true},
        {path: '/401', component: Err401, hidden: true},
        {
            path: '/',
            component: Layout,
            redirect: '/dashboard',
            name: '首页',
            hidden: true,
            children: [{path: 'dashboard', component: dashboard}]
        },
        {
            path: '/goodsManagement',
            component: Layout,
            redirect: '/goodsManagement/index',
            icon: 'zujian',
            noDropdown: true,
            children: [
                {path: 'index', component: GoodsManagement, name: '物品管理'}
            ],
        },
        {
            path: '/returnManagement',
            component: Layout,
            redirect: '/returnManagement/index',
            icon: 'EXCEL',
            noDropdown: true,
            children: [
                {path: 'index', component: ReturnManagement, name: '归还管理'}
            ],
        },
        {
            path: '/statistic',
            component: Layout,
            redirect: '/statistic/index',
            icon: 'tubiaoleixingzhengchang',
            noDropdown: true,
            children: [
                {path: 'index', component: Statistic, name: '统计'}
            ],
        },
        {
            path: '/accountManagement',
            component: Layout,
            redirect: '/accountManagement/index',
            icon: 'quanxian',
            noDropdown: true,
            children: [
                {path: 'index', component: AccountManagement, name: '帐户管理'}
            ],
        },
        {path: '*', redirect: '/404', hidden: true}
    ]
});
