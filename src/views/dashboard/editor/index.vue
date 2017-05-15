<template>
    <div>
        请点击左侧边栏菜单进入相应功能
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import countTo from 'vue-count-to';
    export default {
        name: 'dashboard-editor',
        components: {},
        data() {
            return {
                chart: null,
                statisticsData: {
                    article_count: 1024,
                    comment_count: 102400,
                    latest_article: [],
                    month_article_count: 28,
                    pageviews_count: 1024,
                    week_article: [
                        {count: 30, week: '201716'},
                        {count: 26, week: '201715'},
                        {count: 31, week: '201714'},
                        {count: 28, week: '201713'},
                        {count: 40, week: '201712'},
                        {count: 41, week: '201711'},
                        {count: 50, week: '201710'},
                        {count: 42, week: '201709'},
                        {count: 36, week: '201708'},
                        {count: 32, week: '201707'},
                        {count: 40, week: '201706'},
                        {count: 41, week: '201705'}
                    ]
                },
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
            recentArticles() {
                return this.list.slice(0, 7)
            }
        },
        methods: {
            fetchData() {
            }
        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: '已发布',
                    draft: '草稿中',
                    deleted: '已删除'
                };
                return statusMap[status];
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .recent-articles-emptyTitle {
        font-size: 16px;
        color: #95A5A6;
        padding-top: 20px;
        text-align: center;
    }

    .dashboard-editor-container {
        padding: 30px 50px;
        .pan-info-roles {
            font-size: 12px;
            font-weight: 700;
            color: #333;
            display: block;
        }
        .info-container {
            position: relative;
            margin-left: 190px;
            height: 150px;
            line-height: 200px;
            .display_name {
                font-size: 48px;
                line-height: 48px;
                color: #212121;
                position: absolute;
                top: 25px;
            }
            .info-wrapper {
                line-height: 40px;
                position: absolute;
                bottom: 0px;
                .info-item {
                    cursor: pointer;
                    display: inline-block;
                    margin-right: 95px;
                    .info-item-num {
                        color: #212121;
                        font-size: 24px;
                        display: inline-block;
                        padding-right: 5px;
                    }
                    .info-item-text {
                        color: #727272;
                        font-size: 14px;
                        padding-right: 5px;
                        display: inline-block;
                    }
                }
            }
            .dashboard-editor-icon {
                width: 22px;
                height: 22px;
            }
        }

        .btn-group {
            margin: 30px 36px 30px 0;
        }
        .main-dashboard-container {
            width: 100%;
            position: relative;
            border: 1px solid #DEE1E2;
            padding: 0 10px;
        }
        .chart-container {
            float: left;
            position: relative;
            padding-right: 10px;
            width: 40%;
            border-right: 1px solid #DEE1E2;
        }
        .recent-articles-container {
            padding: 12px 12px 0px;
            float: left;
            width: 60%;
            position: relative;
            .recent-articles- {
                &title {
                    font-size: 16px;
                    color: #95A5A6;
                    letter-spacing: 1px;
                    padding-left: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #DEE1E2;
                }
                &more {
                    color: #2C3E50;
                    font-size: 12px;
                    float: right;
                    margin-right: 25px;
                    line-height: 40px;
                    &:hover {
                        color: #3A71A8;
                    }
                }
                &wrapper {
                    padding: 0 20px 0 22px;
                    .recent-articles- {
                        &item {
                            cursor: pointer;
                            padding: 16px 100px 16px 16px;
                            border-bottom: 1px solid #DEE1E2;
                            position: relative;
                            &:before {
                                content: "";
                                height: 104%;
                                width: 0px;
                                background: #30B08F;
                                display: inline-block;
                                position: absolute;
                                opacity: 0;
                                left: 0px;
                                top: -2px;
                                transition: 0.3s ease all;
                            }
                            &:hover {
                                &:before {
                                    opacity: 1;
                                    width: 3px;
                                }
                            }
                        }
                        &status {
                            font-size: 12px;
                            display: inline-block;
                            color: #9B9B9B;
                            padding-right: 6px;
                        }
                        &content {
                            font-size: 13px;
                            color: #2C3E50;
                            &:hover {
                                color: #3A71A8;
                            }
                        }
                        &time {
                            position: absolute;
                            right: 16px;
                            top: 16px;
                            color: #9B9B9B;
                        }
                    }
                }
            }

        }
    }
</style>
