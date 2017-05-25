import axios from 'axios';
import {Message} from 'element-ui';
import store from '../store';
import router from '../router';
import Cookies from 'js-cookie';

export function fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: process.env.BASE_API,
        });
        const hasQues = options.url.indexOf('?');
        instance({
            ...options,
            url: options.url + (Cookies.get('X-Ivanka-Token') ? ((hasQues >= 0 ? '&' : '?') + 'token=' + Cookies.get('X-Ivanka-Token')) : '')
        })
            .then(response => {
                const res = response.data;
                if (res.success) {

                    resolve(res);
                } else if (res.code === 4001) {
                    //重新登录
                    Message({
                        message: '请重新登录',
                        type: 'error',
                        duration: 5 * 1000
                    });
                    store.dispatch('FedLogOut').then(() => {
                        router.push({path: '/login'});
                        console.log(111)
                    });
                    reject(res);
                }
            })
            .catch(error => {
                Message({
                    message: error,
                    type: 'error',
                    duration: 5 * 1000
                });
                console.log(error); // for debug
                reject(error);
            });
    });
}

export default function _fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: process.env.BASE_API,
            // timeout: 2000,
            headers: {'X-Ivanka-Token': store.getters.token}
        });
        instance({...options, url: options.url + '&token=' + Cookies.get('X-Ivanka-Token')})
            .then(response => {
                const res = response.data;
                if (res.code !== 20000) {
                    console.log(options); // for debug
                    Message({
                        message: res.message,
                        type: 'error',
                        duration: 5 * 1000
                    });
                    // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
                    if (res.code === 50008 || res.code === 50014 || res.code === 50012) {
                        Message({
                            message: res.message,
                            type: 'error',
                            duration: 5 * 1000
                        });
                        // 登出
                        store.dispatch('FedLogOut').then(() => {
                            router.push({path: '/login'})
                        });
                    }
                    reject(res);
                }
                resolve(res);
            })
            .catch(error => {
                Message({
                    message: '发生异常错误,请刷新页面重试,或联系程序员',
                    type: 'error',
                    duration: 5 * 1000
                });
                console.log(error); // for debug
                reject(error);
            });
    });
}
