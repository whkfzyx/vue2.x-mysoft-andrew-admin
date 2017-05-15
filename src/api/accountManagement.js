import {fetch} from 'utils/fetch';

export function getAccountList(query) {
    return fetch({
        url: '/getAccountList',
        method: 'get',
        params: query
    });
}
