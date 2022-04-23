<template>
  <Layout>
    <template v-slot:inner>
      <div style="display: flex; justify-content: space-between">
        <el-form label-width="80px" style="display: flex">
          <el-form-item label="物质名称">
            <el-input
              v-model="search.materialName"
              v-on:input="research"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="search.precedenceLevel"
              placeholder="请选择"
              v-on:change="research"
              filterable
              v-on:blur="selectBlur"
            >
              <el-option label="全部" value="0"></el-option>
              <el-option label="重要且紧急" value="1"></el-option>
              <el-option label="不重要但紧急" value="2"></el-option>
              <el-option label="重要但不急" value="3"></el-option>
              <el-option label="不重要也不急" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- <el-button @Click="inportReadyInfo" style="height:40px">导入</el-button> -->
        <!-- <el-button type="primary" style="height: 16px">新增物资</el-button> -->
        <el-upload 
        :action="$http.baseURL + '/MaterialPurchase/UploadAlreadyMoughtMateral'" 
        method="post"
        :headers="headers"
        :on-success="uploadSuccess">
          <el-button type="primary">导入</el-button>
        </el-upload>
      </div>
      <el-divider class="hir-line"></el-divider>

      <el-table :data="tableData" highlight-current-row height="calc( 100vh - 225px)" >
        <el-table-column prop="kid" label="序号" width="50">
          <template #default="scope">
            {{ ++scope.$index }}
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="物资名称" width="180" />
        <el-table-column prop="modelNumber" label="物资型号" width="120" />
        <el-table-column prop="actualQuantities" label="购买数量" width="80" />
        <el-table-column prop="actualPrice" label="购买单价" width="80" />
        <el-table-column
          prop="materialPurchaseViewModel.precedenceLevel"
          label="优先级"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="购买时间"
          width="150"
        ></el-table-column>
        <el-table-column prop="actualLocation" label="购买地点" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" @click="lookDetail(scope.row)">详情</el-button>
                <el-button type="text" v-if="scope.row.materialPurchaseViewModel != null"  @click="lookEntrust(scope.row.materialPurchaseViewModel)">委托</el-button>
            </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div style="text-align: right; padding-right: 23px; padding-top: 20px">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          @current-change="getCurrentPageIndex"
          @size-change="handleChange"
          :page-size="search.pageSize"
          :page-sizes="[10, 20, 50, 999]"
          :total="count"
        ></el-pagination>
      </div>
      <!-- 弹出层 -->
      <el-dialog title="委托单" v-model="isShowDialog" width="680px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div >
            <el-form-item label="委托" prop="userGid"
              ><el-avatar :size="40" :src="$http.baseURL+ form.userInfo.userAvatarUrl">{{
                form.userInfo.userAvatarUrl == "" ? "添加" : ""
              }}</el-avatar>
              <div class="none-select">
                {{ form.userInfo.nickName }}
              </div></el-form-item
            >
          </div>
          <div style="display: flex">
            <el-form-item label="物质名称" prop="materialName">
              <el-input
                v-model="form.materialName"
                placeholder="请输入物品名称"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="物质类型">
              <el-input
                v-model="form.modelNumber"
                placeholder="请输入物品型号"
                disabled
              ></el-input>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="购买数量" prop="quantityRequired">
              <el-input
                v-model.number="form.quantityRequired"
                placeholder="请输入数量" 
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="金额">
              <el-input v-model="form.unitPrice" placeholder="0.00" disabled>
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="地点">
            <el-input
              v-model="form.suggestLocation"
              placeholder="请输入建议地点"
              disabled
            ></el-input>
          </el-form-item>
          <div style="display: flex">
            <el-form-item label="优先级">
              <el-radio-group v-model="form.precedenceLevel" disabled >
                <el-radio label="重要且紧急">重要且紧急</el-radio>
                <el-radio label="不重要但紧急">不重要但紧急</el-radio>
                <el-radio label="重要但不急">重要但不急</el-radio>
                <el-radio label="不重要也不急">不重要也不急</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" rows="5" disabled></el-input>
          </el-form-item>
          <el-form-item label="发布日期"><p style="text-align:left;">{{this.form.createTime}}</p></el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" @click="purchase('form')">确定</el-button> -->
            <el-button @click="isShowDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="购置记录" v-model="isShowAlreadyBought"> 
        <el-form>
          <div style="display: flex">
            <el-form-item label="物质名称" prop="materialName">
              <el-input
                v-model="detail.materialName"
                placeholder="请输入物品名称"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="物质类型">
              <el-input
                v-model="detail.modelNumber"
                placeholder="请输入物品型号"
                disabled
              ></el-input>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="购买数量" prop="quantityRequired">
              <el-input
                v-model.number="detail.actualQuantities"
                placeholder="请输入数量" 
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="金额">
              <el-input v-model="detail.actualPrice" placeholder="0.00" disabled>
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="地点">
            <el-input
              v-model="detail.suggestLocation"
              placeholder="请输入建议地点"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="购置日期"><p style="text-align:left;">{{this.detail.createTime}}</p></el-form-item>
          <el-form-item>
            <el-button @click="isShowAlreadyBought = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
  </Layout>
</template>
<script>
import Layout from "../../components/Layout.vue";
import { ElLoading, ElMessageBox, UploadUserFile, UplodaFile } from "element-plus";
export default {
  name: "AlreadyBought",
  components: {
    Layout,
    ElMessageBox,
    ElLoading
  },
  data() {
    return {
      tableData: [],
      form: {
        materialName: "",
        ModelNumber: "",
        quantityRequired: 0,
        unitPrice: null,
        suggestLocation: "",
        precedenceLevel: "不重要但紧急",
        remark: "",
        userInfo: {
          nickName: "选择委托人",
          userAvatarUrl: "",
        },
      },
      rules: {
        materialName: [
          { required: true, message: "材料名称不能为空", trigger: "blur" },
          { max: 255, message: "长度不能超过 255 个字符", trigger: "blur" },
        ],
        quantityRequired: [
          { required: true, message: "购置数量不能为空", trigger: "blur" },
          { type: "number", message: "请输入整数", trigger: "blur" },
        ],
      },
      search: {
        materialName: "",
        precedenceLevel: "0",
        pageSize: 10,
        pageIndex: 1
      },
      detail: {},
      count:0,
      isShowDialog: false,
      isShowAlreadyBought: false,
      headers:{
        authorization: "bearer " + localStorage["token"]
      }
    };
  },
  methods: {
    // 获取购买记录
    getAlreadyBoughtMaterialListByPage() {
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
        .get(
          `/MaterialPurchase/GetAlreadyBoughtMaterialListByPage`,
          { params: { ...this.search } }
        )
        .then(({ data, code, message, count }) => {
          if (code == 200) {
            this.tableData = data;
            this.count = count;
          }
          loading.close();
          this.$showMessage(code, message);
        });
    },
    // 重新搜索数据列表集合
    research() {
      if (this.searchMark) {
        window.clearTimeout(this.searchMark);
        this.searchMark = null;
      }
      this.searchMark = window.setTimeout(() => {
        this.getAlreadyBoughtMaterialListByPage();
      }, 1000);
    },
    selectBlur() {},
    getCurrentPageIndex(item) {
      this.search.pageIndex = item;
      this.getAlreadyBoughtMaterialListByPage();
    },
    handleChange(item) {
      this.search.pageSize = item;
      this.getAlreadyBoughtMaterialListByPage();
    },

    lookDetail(item){
      console.log(item)
      this.detail = item;
      this.isShowAlreadyBought = true
    },
    lookEntrust(item){
        this.form = item;
        this.isShowDialog = true;
    },
    // 导入
    uploadSuccess({code, message}, file, files){
      this.$showMessage(code,message,()=> {
        this.getAlreadyBoughtMaterialListByPage();
      })
    }
  },
  mounted() {
    this.getAlreadyBoughtMaterialListByPage();
  },
};
</script>

<style lang="scss" scoped>
</style>