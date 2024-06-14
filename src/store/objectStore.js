import { createStore } from 'vuex';

const store = createStore({
    state: {
        ali: "https://online-store-wenruyv.oss-cn-beijing.aliyuncs.com",
        hw: "https://tdx-online-store.obs.myhuaweicloud.com"
    },
    mutations: {
    },
    actions: {
    },
    getters: {
        ali: state => state.ali,
        hw: state => state.hw,
        urlPrefix: state => state.hw
    }
});

export default store;
