<template>
  <router-view/>
</template>

<script setup>
import axios from "axios";
//本地部署
axios.defaults.baseURL = "http://localhost:8780";
//服务器部署
// axios.defaults.baseURL = '/store';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
