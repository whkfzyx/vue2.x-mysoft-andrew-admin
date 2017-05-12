import {fetch} from 'utils/fetch';

export function getShouldReturnList(query) {
    return fetch({
        url: '/getShouldReturnList',
        method: 'get',
        params: query
    });
}

export function returnFixedAsset(query) {
    return fetch({
        url: '/returnFixedAsset',
        method: 'get',
        params: query
    });
}
