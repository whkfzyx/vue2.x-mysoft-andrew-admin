import {fetch} from 'utils/fetch';

export function getShouldReturnList(query) {
    return fetch({
        url: 'getshouldreturnlist?type=' + query.type + '&department=' + query.department + '&page=' + (query.page || 1) + '&pageSize=' + (query.pageSize || 20),
        method: 'GET',
    });
}

export function returnFixedAsset(number) {
    return fetch({
        url: '/goodsreturn',
        method: 'POST',
        data: {
            number: number,
        },
    });
}
