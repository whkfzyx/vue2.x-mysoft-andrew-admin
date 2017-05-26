import {loginByEmail, logout, getInfo, getEnum} from 'api/login';
import Cookies from 'js-cookie';
import {Message} from 'element-ui';

const user = {
    state: {
        email: Cookies.get('email') || '',
        uid: undefined,
        token: Cookies.get('X-Ivanka-Token'),
        roles: [],
        enumValues: [],
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_EMAIL: (state, email) => {
            state.email = email;
            Cookies.set('email', email);
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_ENUMS: (state, data) => {
            state.enumValues = data;
        },
    },

    actions: {
        // 邮箱登录
        LoginByEmail({commit}, userInfo) {
            const email = userInfo.email.trim();
            return new Promise((resolve, reject) => {
                loginByEmail(email, userInfo.password).then(response => {
                    const data = response.data;
                    Cookies.set('X-Ivanka-Token', data.token);
                    commit('SET_TOKEN', data.token);
                    commit('SET_EMAIL', email);
                    commit('SET_ROLES', ['admin']);
                    resolve();
                }, err => {
                    Message({
                        message: '用户名/密码有错误',
                        type: 'error',
                        duration: 2 * 1000
                    });
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                commit('SET_ROLES', ['admin']);
                resolve();
            });
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    Cookies.remove('X-Ivanka-Token');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('X-Ivanka-Token');
                resolve();
            });
        },

        //get enums
        GetEnumValues({commit}) {
            return new Promise(resolve => {
                getEnum().then(response => {
                    const data = response.data;
                    commit('SET_ENUMS', data);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
    }
};

export default user;
