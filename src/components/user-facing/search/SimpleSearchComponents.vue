<script setup>
import SearchBox from "@/components/user-facing/search/SearchBox.vue";
import {defineEmits} from "vue";
import {useStore} from "vuex";

const store = useStore();
const urlPrefix = store.getters['urlStore/urlPrefix'];
const emit = defineEmits(["search"]);

function handle(item) {
  emit("search", item);
}
</script>

<template>
  <table id="simpleSearch">
    <tr>
      <td style="margin-right: 50%; text-align: left">
        <router-link to="/">
          <img :src="`${urlPrefix}/header/simpleLogo.png`" alt="logo" style="float: left"/>
        </router-link>
      </td>
      <td style="text-align: right">
        <SearchBox @click="handle" style="float: right;"/>
      </td>
    </tr>
  </table>
</template>

<style scoped>
#simpleSearch {
  overflow: hidden;
  width: 70%;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
}

td {
  vertical-align: center;
}
</style>