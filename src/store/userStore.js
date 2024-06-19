import axios from 'axios';

export default {
    namespaced: true,
    state: {
        token: localStorage.getItem('token') || ''
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        clearToken(state) {
            state.token = '';
            localStorage.removeItem('token');
        }
    },
    actions: {
        login({commit}, credentials) {
            return axios.post('/user/login', credentials)
                .then(response => {
                    const token = response.headers['authorization']; // 从响应头中获取 token
                    if (token) {
                        commit('setToken', token.replace('Bearer ', '')); // 去掉 'Bearer ' 前缀
                        axios.defaults.headers.common['Authorization'] = token;
                    }
                });
        },
        logout({commit}) {
            commit('clearToken');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
};
