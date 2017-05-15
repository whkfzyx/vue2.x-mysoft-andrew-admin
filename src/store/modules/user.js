import {loginByEmail, logout, getInfo} from 'api/login';
import Cookies from 'js-cookie';

const user = {
    state: {
        email: '',
        uid: undefined,
        token: Cookies.get('token'),
        roles: [],
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
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
    },

    actions: {
        // 邮箱登录
        LoginByEmail({commit}, userInfo) {
            const email = userInfo.email.trim();
            return new Promise((resolve, reject) => {
                loginByEmail(email, userInfo.password).then(response => {
                    const data = response.data;
                    commit('SET_TOKEN', data.token);
                    commit('SET_EMAIL', email);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    const data = response.data;
                    commit('SET_ROLES', data.role);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
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
                resolve();
            });
        }
    }
};

export default user;
