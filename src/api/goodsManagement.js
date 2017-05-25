import {fetch} from 'utils/fetch';

export function fetchList(query) {
    return fetch({
        url: 'getgoodslist?type=' + query.type + '&department=' + query.department + '&page=' + (query.page || 1) + '&pageSize=' + (query.pageSize || 20),
        method: 'get'
    });
}

export function removeGoods(data) {
    return fetch({
        url: 'delgood',
        method: 'POST',
        data:data
    });
}

export function addGoods(data) {
    return fetch({
        url: 'addgood',
        method: 'POST',
        data: data,
    });
}

export function editgoods(data) {
    return fetch({
        url: 'editgood',
        method: 'POST',
        data: data,
    });
}

export function uploadImg(data) {
    return fetch({
        url: 'uploadimg',
        method: 'POST',
        data: data,
        headers: {'Content-Type': 'multipart/form-data'},
    });
}
