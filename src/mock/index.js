import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import loginAPI from './login';
import goodsManagement from './goodsManagement';
import returnManagement from './returnManagement';
import statistics from './statistics';
import accountManagement from './accountManagement';
const mock = new MockAdapter(axios);

// 物品管理
mock.onGet('/getGoodsList').reply(goodsManagement.getList);

// 归还管理
mock.onGet('/getShouldReturnList').reply(returnManagement.getShouldReturnList);
mock.onGet('/returnFixedAsset').reply(returnManagement.returnFixedAsset);

// 统计
mock.onGet('/fetchStatistics').reply(statistics.fetchStatistics);

// 管理员帐户管理
mock.onGet('/getAccountList').reply(accountManagement.getAccountList);


// 登录相关
mock.onPost('/login/loginbyemail').reply(loginAPI.loginByEmail);
mock.onPost('/login/logout').reply(loginAPI.logout);
mock.onGet('/user/info').reply(loginAPI.getInfo);


export default mock;
