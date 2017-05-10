import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/getGoodsList',
    method: 'get',
    params: query
  });
}
