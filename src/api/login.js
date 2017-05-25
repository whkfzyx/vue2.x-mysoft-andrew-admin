import {fetch} from 'utils/fetch';

export function loginByEmail(email, password) {
    const data = {
        username: email,
        password
    };
    return fetch({
        url: 'login',
        method: 'post',
        data: data
    });
}
export function getEnum() {
    return fetch({
        url: 'getenum',
        method: 'get',
    });
}

export function logout() {
    return fetch({
        url: '/login/logout',
        method: 'post'
    });
}


export function getInfo(token) {
    return fetch({
        url: '/user/info',
        method: 'get',
        params: {token}
    });
}

