<script setup>
import {useStore} from "vuex";

const store = useStore();
const urlPrefix = store.getters['urlStore/urlPrefix'];
</script>

<template>
  <router-link to="/">
    <img :src="`${urlPrefix}/header/simpleLogo.png`" alt="logo" id="logo">
  </router-link>
</template>

<style scoped>
img {
  float: left;
}
</style>