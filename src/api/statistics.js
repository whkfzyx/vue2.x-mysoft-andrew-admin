import {fetch} from 'utils/fetch';

export function fetchStatistics(query) {
    return fetch({
        url: 'getstatisticslist?startdate=' + query.dateRange[0] + '&enddate=' + query.dateRange[1] + '&type=' + query.type + '&department=' + query.department + '&page=' + (query.page || 1) + '&pageSize=' + (query.pageSize || 20),
        method: 'GET',
    });
}
