import { fetch } from 'utils/fetch';

export function fetchStatistics(query) {
  return fetch({
    url: '/fetchStatistics',
    method: 'get',
    params: query
  });
}
