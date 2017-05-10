import Mock from 'mockjs';


const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        goodsId: '@increment',
        img: 'https://oixyh3u6e.qnssl.com/livingearth/livingearth.png',
        name: '@ctitle(2, 5)',
        'type|1': ['lowValue', 'fixedAsset', 'loveHouse'],
        'department|1': ['administration', 'finance', 'it'],
        frequency: '@integer(300, 5000)',
        duration: +Mock.Random.date('T'),
        stock: '@integer(40, 1000)',
    }));
}

export default {
    getList: config => {
        const {page, pageSize} = config.params;
        const pageList = List.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1));

        return new Promise(resolve => {
            setTimeout(() => {
                resolve([200, {
                    success: true,
                    msg: '',
                    data: {
                        total: List.length,
                        list: pageList
                    },
                }]);
            }, 100);
        })
    },

};
