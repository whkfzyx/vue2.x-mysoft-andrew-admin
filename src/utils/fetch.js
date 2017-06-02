import axios from 'axios';
import {Notification} from 'element-ui';
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
                    Notification({
                        message: '请重新登录',
                        type: 'error',
                        duration: 5 * 1000
                    });
                    store.dispatch('FedLogOut').then(() => {
                        router.push({path: '/login'});
                    });
                    reject(res);
                } else {
                    reject(res);
                }
            }).catch(error => {
            console.log(error); // for debug
            reject(error);
        });
    });
}
