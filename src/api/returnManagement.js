import {fetch} from 'utils/fetch';

export function getShouldReturnList(query) {
    return fetch({
        url: 'getshouldreturnlist?type=' + query.type + '&department=' + query.department + '&page=' + (query.page || 1) + '&pageSize=' + (query.pageSize || 20),
        method: 'GET',
    });
}

export function returnFixedAsset(query) {
    return fetch({
        url: '/returnFixedAsset',
        method: 'get',
        params: query
    });
}
