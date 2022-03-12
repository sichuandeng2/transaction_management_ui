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
          <el-form-item label="优先级">
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
        <!-- <el-button type="primary" style="height: 16px">新增物资</el-button> -->
      </div>
      <el-divider class="hir-line"></el-divider>
      <!-- 表格 -->
      <el-table :data="tableData" highlight-current-row>
        <el-table-column prop="kid" label="序号" width="50">
          <template #default="scope">
            {{ ++scope.$index }}
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="物资名称" width="180" />
        <!-- <el-table-column prop="modelNumber" label="物资型号" width="120" /> -->
        <el-table-column prop="quantityRequired" label="数量" width="80" />
        <el-table-column prop="unitPrice" label="单价" width="80" />
        <el-table-column
          prop="precedenceLevel"
          label="优先级"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="发布日期"
          width="150"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="80" />
        <el-table-column prop="suggestLocation" label="建议地点" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" size="small" @click="clickDetail(scope.row)">购置</el-button>
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
      <el-dialog title="详情" v-model="isShowDialog" width="680px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div >
            <el-form-item label="委托" prop="userGid"
              ><el-avatar :size="40" :src="form.userInfo.userAvatarUrl">{{
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
              ></el-input>
            </el-form-item>
            <el-form-item label="物质类型">
              <el-input
                v-model="form.modelNumber"
                placeholder="请输入物品型号"
              ></el-input>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="购买数量" prop="quantityRequired">
              <el-input
                v-model.number="form.quantityRequired"
                placeholder="请输入数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="金额" prop="unitPrice">
              <el-input v-model.number="form.unitPrice" placeholder="0.00">
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="地点">
            <el-input
              v-model="form.suggestLocation"
              placeholder="请输入建议地点"
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
            <el-input v-model="form.remark" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="purchase('form')">确定</el-button>
            <el-button @click="isShowDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
  </Layout>
</template>

<script>
import Layout from "../../components/Layout.vue";
import { ElLoading, ElMessageBox } from "element-plus";
export default {
  name: "PurchaseMaterials",
  components: {
    Layout,
	ElLoading,
	ElMessageBox
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
        unitPrice: [
          { required: true, message: "金额数量不能为空", trigger: "blur" },
          { type: "number", message: "请输入金额", trigger: "blur" },
        ],
      },
      search: {
        materialName: "",
        precedenceLevel: "0",
        pageSize: 10,
        pageIndex: 1,
      },
      count: 0,
      isShowDialog: false,
    };
  },
  methods: {
    // 获取购买记录
    getBuyMaterialListByPage() {
      this.$http
        .get(
          `/MaterialPurchase/GetWillBuyMateralLitByPage`,
          { params: { ...this.search } }
        )
        .then(({ data, code, message, count }) => {
          if (code == 200) {
            this.tableData = data;
            this.count = count;
          }
          this.showMessage(code, message, () => {});
        });
    },
    // 重新搜索数据列表集合
    research() {
      if (this.searchMark) {
        window.clearTimeout(this.searchMark);
        this.searchMark = null;
      }
      this.searchMark = window.setTimeout(() => {
        this.getBuyMaterialListByPage();
      }, 1000);
    },
    selectBlur() {},
    getCurrentPageIndex(item) {
      this.search.pageIndex = item;
      this.getBuyMaterialListByPage();
    },
    handleChange(item) {
      this.search.pageSize = item;
      this.getBuyMaterialListByPage();
    },
    clickDetail(item) {
      console.log(item);
      this.form = item;
      this.isShowDialog = true;
    },
	purchase(formName){
		console.log(this.form)
		this.form.precedenceLevel = 0
		this.form.status = 2
		this.$refs[formName].validate((valid) => {
		if(valid){
          const loading = ElLoading.service({
            fullscreen: false,
            text: "服务连接中......",
            background: "rgba(0, 0, 0, 0.8)",
          });
          this.$http
            .post(
              `/MaterialPurchase/BuyMateralPurchase`,
              { ...this.form }
            )
            .then(({ data, code, message }) => {
              if (code == 200) {
                this.$message({
                  message: message,
                  type: "success",
                  duration: 500,
                  onClose: () => {
                    this.getBuyMaterialListByPage();
                  },
                });
              } else {
                this.$message({
                  message: message,
                  type: "error",
                  duration: 3000,
                });
              }
              loading.close();
            });
          this.isShowDialog = false;
        } else {
		  console.log("表单验证失败")
          return false;
        }
      });
	},
	    // 显示消息
    showMessage(code, message, fun, duration = 1500) {
      let statu = "";
      if (code == 200) {
        statu = "success";
        duration = 500;
      } else {
        statu = "error";
      }
      this.$message({
        message: message,
        type: statu,
        duration: duration,
        onClose: fun,
      });
    },
  },
  mounted() {
    this.getBuyMaterialListByPage();
  },
};
</script>

<style lang="scss" scoped>
</style>