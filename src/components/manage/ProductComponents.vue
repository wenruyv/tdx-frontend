<template>
  <div style="width: 97%; margin-left: auto; margin-right: auto;">
    <el-breadcrumb class="custom-breadcrumb breadcrumb-center" separator="/">
      <el-breadcrumb-item>
        <a class="category-link" @click="handleClick">所有分类</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="currentCategory">{{ currentCategory }}</el-breadcrumb-item>
      <el-breadcrumb-item class="breadcrumb-button-right">
        <el-button type="primary" @click="handleAddProduct">添加商品</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog v-model="dialogVisible" title="添加商品" width="50%">
      <el-form ref="form" :model="formData" label-width="100px">
        <el-form-item label="产品名称">
          <el-input v-model="formData.productName"></el-input>
        </el-form-item>
        <el-form-item label="产品小标题">
          <el-input v-model="formData.productSubtitle"></el-input>
        </el-form-item>
        <el-form-item label="原价格">
          <el-input-number v-model="formData.originalPrice"></el-input-number>
        </el-form-item>
        <el-form-item label="优惠价格">
          <el-input-number v-model="formData.discountedPrice"></el-input-number>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="formData.inventory"></el-input-number>
        </el-form-item>
      </el-form>

      <div class="centered-container">
        <el-button class="centered-button" plain type="primary" @click="submitAddForm">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogVisible2" title="修改产品" width="50%">
      <el-form ref="form" :model="formData" label-width="100px">
        <el-form-item label="产品名称">
          <el-input v-model="formData.productName"></el-input>
        </el-form-item>
        <el-form-item label="产品小标题">
          <el-input v-model="formData.productSubtitle"></el-input>
        </el-form-item>
        <el-form-item label="原价格">
          <el-input-number v-model="formData.originalPrice"></el-input-number>
        </el-form-item>
        <el-form-item label="优惠价格">
          <el-input-number v-model="formData.discountedPrice"></el-input-number>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="formData.inventory"></el-input-number>
        </el-form-item>
        <el-form-item>
          <div class="centered-container">
            <el-button class="centered-button" type="primary" @click="submitEditForm">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="singleDialogVisible" title="添加简介图片（建议 800px * 800px）">
      <div>
        <input id="singleImage" ref="selectedFile1" type="file" @change="onFileChange1"/>
        <el-button plain type="primary" @click="uploadSingle">上传</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="添加详情图片（建议宽度 790px）">
      <div>
        <input id="multipleImage" ref="selectedFile2" type="file" @change="onFileChange2"/>
        <el-button plain type="primary" @click="uploadDetail">上传</el-button>
      </div>
    </el-dialog>

    <div class=table-container>
      <el-table :data="tableData" stripe style="width: 100%; margin-bottom: 20px">
        <el-table-column align="center" label="ID" prop="id" width="80"></el-table-column>
        <el-table-column align="left" label="产品名称" prop="name" width="480"></el-table-column>
        <el-table-column align="left" label="产品小标题" prop="subTitle" width="480"></el-table-column>
        <el-table-column align="center" label="原价格" prop="originalPrice" width="100"></el-table-column>
        <el-table-column align="center" label="优惠价格" prop="promotePrice" width="100"></el-table-column>
        <el-table-column align="center" label="库存数量" prop="stock" width="100"></el-table-column>
        <el-table-column align="center" fixed="right" label="编辑" width="80">
          <template v-slot="scope">
            <el-button :style="{backgroundColor: 'transparent', borderColor: 'transparent'}" size="small" type="primary"
                       @click="handleEdit(scope.row)">
              <i class="fa fa-edit" style="color: blue;"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="删除" width="80">
          <template v-slot="scope">
            <el-button :style="{backgroundColor: 'transparent', borderColor: 'transparent'}" size="small"
                       @click="handleDelete(scope.row)">
              <i class="fa fa-trash" style="color: red;"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="设置属性" width="100">
          <template v-slot="scope">
            <el-button :style="{backgroundColor: 'transparent', borderColor: 'transparent'}" size="small"
                       @click="setProperty(scope.row)">
              <i class="fa fas fa-plus" style="color: green;"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="添加简介图片" width="120">
          <template v-slot="scope">
            <el-button :style="{backgroundColor: 'transparent', borderColor: 'transparent'}" size="small"
                       @click="setSingle(scope.row)">
              <i class="fa fas fa-plus" style="color: green;"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="添加详情图片" width="120">
          <template v-slot="scope">
            <el-button :style="{backgroundColor: 'transparent', borderColor: 'transparent'}" size="small"
                       @click="setDetail(scope.row)">
              <i class="fa fas fa-plus" style="color: green;"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  data() {
    return {
      singleImageContent: '',
      detailImageContent: '',
      currentCategory: '当前分类',
      cid: '',
      tableData: [],
      dialogVisible: false, // 控制对话框的显示与隐藏
      dialogVisible2: false,
      singleDialogVisible: false,
      detailDialogVisible: false,
      router: useRouter(),
      productId: '',
      selectedFile1: null,
      selectedFile2: null,
      formData: {
        productName: '',
        productSubtitle: '',
        originalPrice: 0,
        discountedPrice: 0,
        inventory: 0
      }
    };
  },
  methods: {
    onFileChange1(e) {
      this.selectedFile1 = e.target.files[0];
      if (this.selectedFile1.type !== "image/jpeg" && this.selectedFile1.type !== "image/png") {
        ElMessage.error("图片格式不正确，请重新选择");
        this.$refs.selectedFile1.value = '';
        this.selectedFile1 = null;
        return;
      }
      let reader = new FileReader();
      reader.onload = (e) => {
        let image = new Image();
        image.onload = () => {
          // alert(image.width)
          if (image.width > 1400 || image.height > 1400) {
            ElMessage.error("图片尺寸应小于 1200px * 1200px，请重新选择");
            this.$refs.selectedFile1.value = '';
            this.selectedFile1 = null;
          }
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile1);
    },
    onFileChange2(e) {
      this.selectedFile2 = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        let image = new Image();
        image.onload = () => {
          if (image.width > 900) {
            ElMessage.error("图片宽度应小于 800px，请重新选择");
            this.$refs.selectedFile2.value = '';
            this.selectedFile2 = null;
          }
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile2);
    },

    uploadSingle() {
      let formData = new FormData();

      formData.append("file", this.selectedFile1);
      // formData.append("filename", "origin_" + name);
      formData.append("filename", this.selectedFile1.name)
      formData.append("type", "type_single");
      formData.append("pid", this.productId);

      axios.post("/upload/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
          .then((res) => {
            this.singleDialogVisible = false;
            if (res.data.flag === true) {
              ElMessage({
                message: '上传成功',
                type: 'success',
                duration: 2 * 1000
              });
            } else {
              ElMessage({
                message: '上传失败',
                type: 'error',
                duration: 2 * 1000
              });
            }
          })
          .catch(() => {
            ElMessage({
              message: '上传失败',
              type: 'error',
              duration: 2 * 1000
            });
          });

      this.$refs.selectedFile1.value = '';
      this.selectedFile1 = null;
      this.selectedFile1Middle = null;
      this.selectedFile1Small = null;
    },

    uploadDetail() {
      let formData = new FormData();
      formData.append("file", this.selectedFile2);
      formData.append("filename", String(Date.now()) + this.selectedFile2.name);
      formData.append("type", "type_detail");
      formData.append("pid", this.productId);

      axios.post("/upload/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
          .then(res => {
            this.detailDialogVisible = false;
            this.$refs.selectedFile2.value = '';
            if (res.data.flag === true) {
              ElMessage({
                message: '上传成功',
                type: 'success',
                duration: 2 * 1000
              });
            } else {
              ElMessage({
                message: '上传失败',
                type: 'error',
                duration: 2 * 1000
              });
            }
          })
          .catch(() => {
            ElMessage({
              message: '上传失败',
              type: 'error',
              duration: 2 * 1000
            });
          });
    },

    setSingle(row) {
      this.productId = row.id;
      this.singleDialogVisible = true;
    },

    setDetail(row) {
      this.productId = row.id;
      this.detailDialogVisible = true;
    },

    getData() {

      // 发送网络请求获取后端数据
      axios.get('category/searchCategoryProperty/' + this.cid)
          .then(response => {
            this.tableData = response.data.data;
          })
          .catch(() => {
            // 请求失败，处理错误
            ElMessage({
              message: '请求数据失败',
              type: 'error',
              duration: 2 * 1000
            });
          });
      // 根据当前页码和每页显示的条数从后端获取数据
      // 更新tableData和total
    },
    handleAddProduct() {
      // 处理按钮点击事件的逻辑
      this.dialogVisible = true; // 打开对话框
    },

    handleDelete(row) {
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(() => {
            // 用户点击了确定按钮
            axios.delete("/product/" + row.id)
                .then(() => {
                  // 删除成功，刷新页面
                  // window.location.reload();
                  this.tableData = this.tableData.filter(item => item.id !== row.id);
                })
                .catch(() => {
                  // 处理删除失败的情况
                  ElMessage({
                    type: 'error',
                    message: '删除失败，请重试！',
                    duration: 2 * 1000
                  });
                });
          })
          .catch(() => {
            // 用户点击了取消按钮或者点击了弹窗外部区域，不执行任何操作
          });
    },
    handleEdit(row) {
      this.productId = row.id;

      this.formData.productName = row.name;
      this.formData.productSubtitle = row.subTitle;
      this.formData.originalPrice = row.originalPrice;
      this.formData.discountedPrice = row.promotePrice;
      this.formData.inventory = row.stock;

      this.dialogVisible2 = true; // 打开对话框
    },
    setProperty(row) {
      this.router.push({
        path: '/property',
        query: {
          name: this.currentCategory,
          id: row.id,
          cid: this.cid,
        }
      });
    },

    handleClick() {
      // 处理点击事件，例如跳转到对应的分类页面
      this.router.push({
        path: '/manage',
      });
      // 执行相应的逻辑...
    },

    async submitAddForm() {
      // 在此处提交表单数据的逻辑
      event.preventDefault(); // 阻止表单默认提交行为
      // 在这里执行表单提交逻辑
      let requests = []; // 存储所有请求

      requests.push(
          axios.post('/product/add', {
            "name": this.formData.productName,
            "originalPrice": this.formData.originalPrice,
            "promotePrice": this.formData.discountedPrice,
            "stock": this.formData.inventory,
            "subTitle": this.formData.productSubtitle,
            "cid": this.cid,
          })
      );

      try {
        const responses = await Promise.all(requests);

        let successAdded = false;
        let showAlert = false;

        responses.forEach(res => {
          if (res.data.flag) {
            successAdded = true; // 设置成功添加标志为true
          } else {
            showAlert = true;
          }
        });

        if (successAdded) {
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: "添加成功"
          });
        } else if (showAlert) {
          ElMessage({
            type: 'error',
            message: '添加失败，请重试！',
            duration: 2 * 1000
          });
        }
      } catch (error) {
        ElMessage({
          type: 'error',
          message: "请求发生错误，请重试！",
          duration: 2 * 1000
        });
      }
      // window.location.reload();
      this.getData();
      this.formData = {
        productName: '',
        productSubtitle: '',
        originalPrice: '',
        discountedPrice: '',
        inventory: '',
      };
    },

    async submitEditForm() {
      // 在此处提交表单数据的逻辑
      event.preventDefault(); // 阻止表单默认提交行为
      // 在这里执行表单提交逻辑
      let requests = []; // 存储所有请求

      requests.push(
          axios.put('/product/edit', {
            "id": this.productId,
            "name": this.formData.productName,
            "originalPrice": this.formData.originalPrice,
            "promotePrice": this.formData.discountedPrice,
            "stock": this.formData.inventory,
            "subTitle": this.formData.productSubtitle,
            "cid": this.cid,
          })
      );

      try {
        const responses = await Promise.all(requests);

        let successAdded = false;
        let showAlert = false;

        responses.forEach(res => {
          if (res.data.flag) {
            successAdded = true; // 设置成功添加标志为true
          } else {
            showAlert = true;
          }
        });

        if (successAdded) {
          ElMessage({
            type: 'success',
            message: '修改成功！',
            duration: 2 * 1000
          });
          this.dialogVisible2 = false;
        } else if (showAlert) {
          ElMessage({
            type: 'error',
            message: '修改失败，请重试！',
            duration: 2 * 1000
          });
        }
      } catch (error) {
        ElMessage({
          type: 'error',
          message: "请求发生错误，请重试！",
          duration: 2 * 1000
        });
      }
      // window.location.reload();
      this.getData();
    }
  },
  created() {
    this.cid = this.$route.query.cid;
    this.currentCategory = this.$route.query.name;
    // 使用获取到的 cid 值进行后续操作
  },
  mounted() {
    this.getData(); // 页面加载时初始化数据
  },
};
</script>

<style scoped>
.custom-breadcrumb {
  background-color: #f0f2f5;
  padding: 10px;
  margin-top: 10px;
  text-align: center;
  display: flex;
  align-items: center;
}

.custom-breadcrumb .el-breadcrumb-item {
  font-size: 14px;
  color: #333;
}

.category-link {
  cursor: pointer;
}

.category-link:hover {
  color: blue;
}

.breadcrumb-button {
  float: right;
}

.breadcrumb-button-right {
  margin-left: auto;
}

.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}


</style>
