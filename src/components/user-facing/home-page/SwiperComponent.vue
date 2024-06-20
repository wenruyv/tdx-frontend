<template>
  <div id="SwiperComponent" class="SwiperComponent">
    <swiper :modules="modules" :pagination="{clickable:true}">
      <swiper-slide>
        <a href="#">
          <img class="imgClass" :src="picSrc[0]" alt="no1">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#">
          <img class="imgClass" :src="picSrc[1]" alt="no2">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#">
          <img class="imgClass" :src="picSrc[2]" alt="no3">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#">
          <img class="imgClass" :src="picSrc[3]" alt="no4">
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import {Swiper, SwiperSlide} from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import {Pagination} from "swiper";
// import store from "@/store/urlStore";
import { mapGetters } from 'vuex';

export default {
  name: "SwiperComponent",
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      modules: [Pagination],
      picSrc: []
    }
  },
  methods: {
    hideSwiper: function () {
      let swiper = document.getElementById("SwiperComponent")
      swiper.style.display = "none"
    },
    showSwiper: function () {
      let swiper = document.getElementById("SwiperComponent")
      swiper.style.display = "block"
    }
  },
  computed: {
    ...mapGetters('urlStore', ['urlPrefix'])
  },
  mounted() {
    // 在mounted生命周期钩子中设置picSrc
    this.picSrc = [
      this.urlPrefix + "/lunbo/1.jpg",
      this.urlPrefix + "/lunbo/2.jpg",
      this.urlPrefix + "/lunbo/3.jpg",
      this.urlPrefix + "/lunbo/4.jpg"
    ];
  }
}
</script>

<style scoped>
#SwiperComponent {
  display: block;
}

img.imgClass {
  width: 100%;
  height: 546px;
}
</style>