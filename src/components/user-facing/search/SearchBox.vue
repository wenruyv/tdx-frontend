<script setup>
import {defineEmits, ref} from 'vue';
import {useRouter} from "vue-router";
import ProductsAsideCategoriesComponent from "@/components/user-facing/home-page/ProductsAsideCategoriesComponent.vue";

const router = useRouter();

var categories = ProductsAsideCategoriesComponent.data().categories;
let keyword = ref("");
const emit = defineEmits(["search"]);

const search = () => {
  // alert(keyword.value)
  emit('search', keyword.value);
  if (!window.location.href.includes("search")) {
    router.push({path: "/search", query: {keyword: keyword.value}});
  }
}

function fastSearch(item) {
  keyword.value = item;
  // alert(keyword.value)
  search();
}
</script>

<template>
  <div class="searchDiv">
    <div style="overflow: hidden;">
      <input v-model="keyword" class="searchEnter" name="keyword" placeholder="电视机" type="text">
      <button class="searchButton" @click="search">搜索</button>
    </div>
    <div class="searchBelow">
      <span v-for="(category,index) in categories" :key="category.cid" class="bottomItem">
        <span v-if="index<3" class="item" style="margin-left: auto; margin-right: auto"
              @click="fastSearch(category.category_name)">{{ category.category_name }}</span>
        <span v-if="index<2" style="margin-left: 5%; margin-right: 5%">|</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
div.searchBelow {
  margin-top: 10px;
  margin-left: -20px;
  text-align: center;
}

div.searchDiv {
  width: 400px;
  margin: 50px auto;
  align-items: center;
  overflow: hidden;
}

div.searchDiv input {
  flex: 1;
  width: 275px;
  border: 1px solid #87CEEB;
  height: 36px;
  margin-left: 2px;
  outline: none;
  float: left;
}

div.searchDiv button {
  width: 110px;
  height: 36px;
  border: 2px solid #87CEEB;
  background-color: #87CEEB;
  margin-left: 2px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  float: left;
}

.item:hover {
  color:lightskyblue;
}

.item {
  color: gray;
  text-decoration: none;
}

span.item {
  margin-left: 10%;
}

.searchButton {
  width: 15%;
}
</style>