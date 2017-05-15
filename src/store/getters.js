const getters = {
    sidebar: state => state.app.sidebar,
    token: state => state.user.token,
    uid: state => state.user.uid,
    email: state => state.user.email,
    roles: state => state.user.roles,
};
export default getters
