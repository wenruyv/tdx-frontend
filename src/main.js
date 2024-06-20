import {createApp} from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import ElementPlus from 'element-plus'
import 'font-awesome/css/font-awesome.min.css';
import store from './store/index'


const app = createApp(App)
app.use(router)
app.use(Antd)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
