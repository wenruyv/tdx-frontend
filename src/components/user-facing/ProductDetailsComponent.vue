<template>
  <div v-if="show" id="mainBody">
    <table class="product-show">
      <tr>
        <td colspan="2">
          <img :src="getCategoryPath(this.data.category)" alt="商品图片" class="top-ad-image">
        </td>
      </tr>

      <tr style="margin-top: 20px">
        <td style="width: 48%">
          <table class="product-show-left">
            <tr>
              <td>
                <div class="big-show-div">
                  <img :src="leftImage" alt="商品图片" class="big-show-image"/>
                </div>
              </td>
            </tr>

            <tr>
              <td align="center">
                <img
                    v-for="item in showImages"
                    :key="item"
                    :src="getImagePath(item)"
                    alt="商品缩略图"
                    class="small-show-image"
                    @mouseover="changeImage(item)"/>
              </td>
            </tr>
          </table>
        </td>

        <td class="product-show-right">
          <div class="product-name">
            {{ data.name }}
          </div>

          <div class="product-sub-title">
            {{ data.subTitle }}
          </div>

          <div class="price-show">
            <div class="juhuasuan">
              <span class="juhuasuanBig">聚划算</span>
              <span>此商品即将参加聚划算，<span class="juhuasuanTime">1天19小时</span>后开始，</span>
            </div>

            <div id="price-show" :style="{ backgroundImage: 'url(' + backgroundImageUrl + ')' }">
              <div style="padding-top: 20px;">
                <span class="common-font">价格</span>
                <span>￥</span>
                <span class="original-price-show">{{ data.originalPrice }}</span>
              </div>

              <div>
                <span class="common-font">促销价</span>
                <span class="promote-dollar">￥</span>
                <span class="promote-price-show">{{ data.promotePrice }}</span>
              </div>
            </div>
          </div>

          <div>
            <span class="common-font">数量</span>
            <el-input-number v-model="count" :max="data.stock" :min="1"></el-input-number>
            <span class="common-font">件&nbsp;库存&nbsp;{{ data.stock }}&nbsp;件</span>
          </div>

          <div class="common-font">
            服务承诺&nbsp;极速退款&nbsp;赠运费险&nbsp;七天无理由退换
          </div>

          <div align="center">
            <el-button plain type="danger" @click="buyProduct">立即购买</el-button>
            <el-button id="inputToShoppingCart" :type="this.buttonType" @click="addToCart">
              <i aria-hidden="true" class="fa fa-shopping-cart"></i>
              &nbsp;加入购物车
            </el-button>
          </div>

        </td>
      </tr>
    </table>

    <el-tabs v-model="activeTab" class="product-show" type="card">
      <el-tab-pane label="商品详情" name="tab1">
        <div class="common-font table-content">
          产品参数: <br/> <br/>
          <div class="properties">
            <div v-for="item in data.properties" :key="item.id" class="product-property">
              <span>{{ item.name }}</span>
              :&nbsp;
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>

        <div align="center" class="images table-content">
          <img
              v-for="item in detailImages"
              :key="item"
              :src="getDetailImagePath(item)"
              alt="商品详情图"
              style="margin-bottom: 5px"/>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="getComment(data.comments.length)" name="tab2">
        <div v-if="data.comments" class="comment-show table-content">
          <div v-for="item in data.comments" :key="item.id" class="comments-show">
            <div class="comment-show-header">
              <span>{{ item.username }}</span>
              <span>{{ item.create_date }}</span>
            </div>

            <div class="comment-show-content">
              {{ item.content }}
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
// import store from "@/store/urlStore";
import {mapGetters} from "vuex";

export default {
  name: "ProductDetails",
  data() {
    return {
      buttonType: "danger",
      show: false,
      router: useRouter(),
      route: useRoute(),
      count: 0,
      leftImage: "",
      pid: pid,
      data: {
        id: 0,
        name: "",
        subTitle: "",
        originalPrice: 0,
        promotePrice: 0,
        stock: 0,
        createDate: "",
        cid: 0,
        images: [],
        properties: [],
        comments: []
      },
      showImages: [],
      detailImages: [],
      activeTab: "tab1",
    }
  },
  methods: {

    async getDetails(id) {
      pid = id
      await axios.get("/user/getUser").then((data) => {
        if (!data.data.flag) //如果没查到,即用户未登录
        {
          uid = -1;
          this.buttonType = "info"
        } else {
          uid = data.data.data.id;
        }
      }).catch(() => {
        uid = -1
      })

      if (uid !== -1) {
        await axios.get("/cart/checkCartStatus", {
          params: {
            "uid": uid,
            "pid": pid
          }
        }).then((data) => {
          console.log(data)
              if (data.data.flag)//如果查询成功
              {
                this.buttonType = data.data.data ? "info" : "danger";//是否在购物车中
              } else {
                ElMessage({
                  message: '查询是否在购物车中失败',
                  type: 'error',
                  duration: 2 * 1000
                });
              }
            })
      }

      await axios.get('/product/details/' + id)
          .then(res => {
            if (res.status === 200 && res.data.flag) {
              this.data = res.data.data;

              this.data.images.forEach(item => {
                if (item.type === "type_single") {
                  this.showImages.push(item);
                } else {
                  this.detailImages.push(item);
                }
              });
              this.showImages.sort((a, b) => b - a)
              this.detailImages.sort((a, b) => b - a)

              if (this.showImages.length > 0) {
                if (this.showImages[0].urlPath !== null)
                  this.leftImage = this.showImages[0].urlPath;
                else
                  this.leftImage = this.urlPrefix + "/productSingle/"
                      + this.showImages[0].id + ".jpg";
              } else
                this.leftImage = "";

              this.data.properties = this.data.properties.filter(item => item.value !== null && item.value !== "");

              this.show = true;
            } else {
              ElMessage({
                message: '获取商品详情失败',
                type: 'error',
                duration: 2 * 1000
              });
              this.router.back();
            }
          })
          .catch(() => {
            ElMessage({
              message: '获取商品详情失败',
              type: 'error',
              duration: 2 * 1000
            });
            this.router.back();
          })
    },
    getCategoryPath(category) {
      if (category.urlPath !== null) {
        return category.urlPath;
      }
      return this.urlPrefix + "/category/" + String(category.id) + ".jpg";
    },
    getImagePath(image) {
      if (image.singleSmall !== null)
        return image.singleSmall;
      return this.urlPrefix + "/productSingleSmall/" + String(image.id) + ".jpg";
    },
    getDetailImagePath(image) {
      if (image.urlPath !== null)
        return image.urlPath;
      return this.urlPrefix + "/productDetail/" + String(image.id) + ".jpg";
    },
    getComment(count) {
      return "累计评价 " + count;
    },
    changeImage(image) {
      if (image.urlPath !== null)
        this.leftImage = image.urlPath;
      else
        this.leftImage = this.urlPrefix + "/productSingle/" + image.id + ".jpg";
    },
    buyProduct() {
      if (uid === -1) {
        ElMessage({
          message: '请先登录',
          type: 'error',
          duration: 2 * 1000
        });
      } else {
        axios.post("/order/createOrder", {
          "uid": uid,
          "orderItems": [{"pid": pid, "count": this.count}]
        }).then((data) => {
          if (data.data.flag) {
            ElMessage({
              message: '创建订单成功，请到我的订单页面付款~',
              type: 'success',
              duration: 2 * 1000
            });
            this.getDetails(this.route.query.id)
          } else {
            ElMessage({
              message: '创建订单失败！',
              type: 'error',
              duration: 2 * 1000
            });
          }
        });
      }

    },
    addToCart() {
      if (uid === -1) {
        ElMessage({
          message: '请先登录',
          type: 'warning',
          duration: 2 * 1000
        });
      } else if (this.buttonType === "info") {
        ElMessage({
          message: '已经在购物车中了～',
          type: 'info',
          duration: 2 * 1000
        });
      } else if (this.buttonType === "danger") {
        axios.post("/cart/addGoods", {
          "uid": uid,
          "pid": pid,
          "count": this.count,
        }).then((data) => {
          if (data.data.flag) {
            ElMessage({
              message: '加入购物车成功',
              type: 'success',
              duration: 2 * 1000
            });
            this.buttonType = "info";

            // this.$root.$emit('updateCartCount');
          } else {
            ElMessage({
              message: '加入购物车失败',
              type: 'error',
              duration: 2 * 1000
            });
          }
        }).catch(() => {
          ElMessage({
            message: '加入购物车过程发生异常！',
            type: 'error',
            duration: 2 * 1000
          });
        })
      }
    },

  },

  async mounted() {
    this.show = false;
    await this.getDetails(this.route.query.id);
    this.show = true;
  },
  computed: {
    backgroundImageUrl() {
      return this.urlPrefix + "/site/priceBackground.png";
    },
    ...mapGetters('urlStore', ["urlPrefix"]),
  }
};

var uid = -1;
var pid = -1;
</script>

<style scoped>
#mainBody {
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  min-width: 1000px;
}

.name {
  font-size: 23px;
  font-weight: bold;
}

.juhuasuan {
  /* height: 40px; */
  background-color: #2DA77A;
  color: white;
  text-align: center;
  line-height: 40px;
  margin-top: 10px;
}

.juhuasuanBig {
  font-size: 18px;
  font-weight: bold;
  font-family: Arial, serif;
}

.juhuasuanTime {
  color: #FFC057;
  font-weight: bold;
}

.big-show-div {
  border: #cccccc solid 1px;
  margin: 2%;
}

.big-show-image {
  vertical-align: middle;
  padding: 2%;
  width: 100%;
}

.el-tabs {
  margin: 20px auto;
}

.top-ad-image {
  width: 100%;
  height: auto;
}

.table-content {
  margin-left: 5%;
  margin-right: 5%;
}

.images {
  margin-left: auto;
  margin-right: auto;
}

.product-show-right {
  height: 95%;
  width: 100%;
  margin-top: 20px;
}

.small-show-image {
  margin: 1%;
  border: #ffffff solid 2px;
}

.small-show-image:hover {
  border: black solid 2px;
}

.product-show {
  max-width: 1000px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.properties {
  overflow: hidden;
}

.product-property {
  width: 32%;
  margin-right: 1%;
  float: left;
  margin-bottom: 10px;
}

.product-name {
  color: black;
  font-size: 16px;
  font-weight: bold;
  margin: 0 10px;
}

.product-sub-title {
  color: #DD2727;
  font-size: 12px;
  font-weight: bold;
  margin: 0 10px;
}

.common-font {
  font-size: 12px;
  color: #999999;
  margin: 0 10px;
}

.original-price-show {
  font-family: Arial, serif;
  font-size: 12px;
  color: #333333;
  text-decoration: line-through;
}

.promote-dollar {
  font-family: Arial, serif;
  font-size: 18px;
  color: #C40000;
}

.promote-price-show {
  color: #c40000;
  font-family: Arial, serif;
  font-size: 30px;
  font-weight: bold;
}

#price-show {
  margin-top: 0;
}

.product-show-right > div {
  margin-top: 25px;
}

.el-button {
  margin-left: 15px;
  margin-right: 15px;
}

.comments-show {
  height: 100px;
  border-bottom: #cccccc 1px solid;
}

.comment-show {
  margin-bottom: 20px;
}

.comment-show-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-show-header span:first-child {
  font-weight: bold;
}

.comment-show-content {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 6px;
}

</style>