<script setup>
import {useStore} from "vuex";

const store = useStore();
</script>

<template>
  <router-link to="/">
    <img :src="`${store.getters.urlPrefix}/header/simpleLogo.png`" alt="logo" id="logo">
  </router-link>
</template>

<style scoped>
img {
  float: left;
}
</style>