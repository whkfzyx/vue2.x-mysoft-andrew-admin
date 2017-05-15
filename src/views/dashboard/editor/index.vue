<template>
    <div>
        欢迎使用【明源小管家-物品领用】，请点击左侧边栏菜单进入相应功能
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'dashboard-editor',
        components: {},
        data() {
            return {
                list: []
            }
        },
        created() {
            this.fetchData();
        },
        computed: {
            ...mapGetters([
                'name',
                'avatar',
                'email',
                'uid',
                'introduction',
                'roles'
            ]),
        },
        methods: {
            fetchData() {
            },
        },
        filters: {}
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
