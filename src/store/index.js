import { createStore } from 'vuex';
import urlStore from './urlStore';
import userStore from './userStore';

const store = createStore({
    modules: {
        urlStore,
        userStore
    }
});

export default store;
