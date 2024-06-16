<template>
  <div>
    <Header></Header>
    <SearchComponents @search="search"></SearchComponents>
  </div>

  <div v-if="show" class="list">
    <div v-for="item in data" :key="item.id" class="list-item">
      <div class="product" @click="showDetails(item)">
        <img :src="getPath(item)" alt="图片" style="width: 100%; height: 85%">
        <div class="price">￥{{ item.originalPrice }}</div>
        <div class="name">{{ item.name.substring(0, 30) }}</div>
      </div>
    </div>
  </div>

  <div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from '@/components/user-facing/header-footer/HeaderComponent.vue'
import SearchComponents from "@/components/user-facing/search/SearchComponents.vue";
import Footer from "@/components/user-facing/header-footer/FooterComponent.vue";
import axios from "axios";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";

const store = useStore();
const router = useRouter();
let data = ref([]);
let show = ref(false);

async function search(params) {
  if (params === "") {
    params = "NULL";
  }
  await axios.get('/product/search/' + params)
      .then(res => {
        console.log(res.data);
        if (res.data.code === 200 || res.data.flag === true) {
          data.value = res.data.data;
          show.value = true;
        } else {
          ElMessage.error("搜索失败，请重试！");
        }
      })
      .catch(() => {
        ElMessage.error("搜索失败，请重试！");
      })
}

// eslint-disable-next-line
function getPath(item) {
  if (item.images && item.images[0] && item.images[0].urlPath)
    return item.images[0]?.urlPath;
  return store.getters.urlPrefix + "/productSingleMiddle/" + item.images[0].id + ".jpg";
}

function showDetails(item) {
  router.push({
    path: '/details',
    query: {
      id: item.id
    }
  })
}

search(router.currentRoute.value.query.keyword);

</script>

<style>

.list {
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  max-width: 1000px;
}

.list-item {
  width: 25%;
  float: left;
  padding: 1%;
  min-height: 380px;
}

.product:hover {
  border: red 3px solid;
  border-radius: 10px;
}

.price {
  color: red;
  font-size: 28px;
  padding-left: 4px;
}

.name {
  font-size: 14px;
  padding-left: 4px;
}

</style>
