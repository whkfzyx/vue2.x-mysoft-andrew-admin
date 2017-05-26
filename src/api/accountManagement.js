import {fetch} from 'utils/fetch';

export function getAccountList(query) {
    return fetch({
        url: 'getaccountlist?department=' + query.department + '&page=' + (query.page || 1) + '&pageSize=' + (query.pageSize || 20),
        method: 'GET'
    });
}

export function createAccount(data) {
    return fetch({
        url: 'addaccount',
        method: 'POST',
        data: data,
    });
}

export function updateAccount(data) {
    return fetch({
        url: 'editaccount',
        method: 'POST',
        data: data,
    });
}

export function removeAccount(data) {
    return fetch({
        url: 'delaccount',
        method: 'POST',
        data: data,
    });
}
