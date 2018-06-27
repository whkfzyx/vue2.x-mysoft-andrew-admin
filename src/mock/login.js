const userMap = {
  admin: {
    role: ['admin'],
    token: 'admin'
  },
  editor: {
    role: ['editor'],
    token: 'editor'
  }
}

export default {
  loginByEmail: config => {
    const { email } = config.params;
    return new Promise((resolve, reject) => {
      if (userMap[email.split('@')[0]]) {
        setTimeout(() => {
          resolve([200, {
            data: userMap[email.split('@')[0]]
          }]);
        }, 500);
      } else {
        reject('账号不正确')
      }
    })
  },
  getInfo: config => {
    const { token } = config.params;
    return new Promise((resolve, reject) => {
      if (userMap[token]) {
        setTimeout(() => {
          resolve([200, {
            data: userMap[token]
          }]);
        }, 100);
      } else {
        reject('获取失败')
      }
    })
  },
  logout: () => new Promise(resolve => {
    setTimeout(() => {
      resolve([200, { data: 'success' }]);
    }, 100);
  })
};
