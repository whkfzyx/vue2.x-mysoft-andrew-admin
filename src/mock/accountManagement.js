import Mock from 'mockjs';


const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        userId: '@increment',
        username: '@first',
        'department|1': ['administration', 'finance', 'it'],
    }));
}

export default {
    getAccountList: config => {
        const {page, pageSize} = config.params;
        const pageList = List.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1));

        return new Promise(resolve => {
            setTimeout(() => {
                resolve([200, {
                    success: true,
                    msg: '',
                    data: {
                        total: List.length,
                        page: page,
                        pageSize: pageSize,
                        list: pageList,
                    },
                }]);
            }, 100);
        })
    },

};
