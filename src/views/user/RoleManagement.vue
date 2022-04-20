<template>
  <Layout>
    <template v-slot:inner>
      <div style="display: flex; justify-content: space-between">
        <el-form label-width="80px" style="display: flex">
          <el-form-item label="角色">
            <el-input
              v-model="search.roleName"
              v-on:input="research"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="inseartUser" style="height: 16px">新增用户</el-button>
      </div>
      <el-table :data="tableData" highlight-current-row max-height="calc( 100vh - 225px)" style="overflow-y: scroll;">
        <el-table-column prop="kid" label="序号" width="50">
          <template #default="scope">
            {{ ++scope.$index }}
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色" width="120" show-overflow-tooltip= true />
        <el-table-column prop="authorityByKid" label="授权" width="320" show-overflow-tooltip= true />
        <el-table-column prop="kid" label="状态" width="50">
          <template #default="scope">
            {{ scope.row.isEnable ? "启用":"停用" }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip= true />
                <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" v-if="!scope.row.isEnable"  @click="changeIsEnable(scope.row.kid, true)">启用</el-button>
                <el-button type="text" v-else @click="changeIsEnable(scope.row.kid, false)">禁用</el-button>
                <el-button type="text" @click="editeUserInformation(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteUser(scope.row.kid)">删除</el-button>
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
      <!-- 编辑弹出层 -->
		<el-dialog :title="(isEdite ? '编辑': '新增') + '用户'" v-model="isShowEditeUserInfo" width="680px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div  >
            <el-form-item label="头像" prop="userGid" v-if="isEdite">
                <el-upload
                  ref="upload"
                  :action="$http.baseURL + '/Account/uploadAvatar'"
                  :headers="customHeaders"
                  :limit="1"
                  :on-success="uploudSuccess"
                >
                  <template #trigger>
                    <el-avatar :size="60" :src="$http.baseURL + form.userAvatarUrl">{{form.userAvatarUrl==''?"添加":""}}</el-avatar>
                    <!-- <el-button type="primary">select file</el-button> -->
                  </template>
                  <el-button class="ml-3" type="success" @click="submitUpload" style="display:none">
                    upload to server
                  </el-button>
                  <!-- <template #tip>
                    <div class="el-upload__tip text-red">
                      limit 1 file, new file will cover the old file
                    </div>
                  </template> -->
                </el-upload>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="账号" prop="userName" v-if="!isEdite">
              <el-input
                v-model="form.userName"
                placeholder="登录账号"
              ></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="用户昵称"
              ></el-input>
            </el-form-item>
          </div>

          <div style="display: flex">
            <el-form-item label="手机" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="微信" prop="wechat">
              <el-input
                v-model="form.wechat"
                placeholder="请输入微信号"
              ></el-input>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="QQ" prop="qq">
              <el-input
                v-model="form.qq"
                placeholder="请输入QQ"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱地址"
              ></el-input>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="性别">
              <el-radio-group v-model="form.userGender">
                <el-radio label="0">未知</el-radio>
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="角色">
              <el-select
                v-model="form.roleByGid"
                multiple
                collapse-tags
                style="width: 240px"
              >
                <el-option
                  v-for="item in roleSelectBoxItem"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="onSubmit('form')">提交</el-button>
            <el-button @click="isShowEditeUserInfo = false">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    </template>
  </Layout>
</template>

<script>
import Layout from "../../components/Layout.vue";
import { ElLoading } from "element-plus";
export default {
  name: "用户管理",
  components:{
    Layout
  },
  data(){
    return {
      tableData: [],
      search: {
        roleName: "",
        pageSize: 10,
        pageIndex: 1
      },
      isShowEditeUserInfo: false,
      form:{
        kid: null,
        roleByGid:[],
      },
      rules: {
        qq: [
          { pattern: /^[1-9][0-9]{4,14}$/, message: '请输入有效的QQ账号' }
        ],
        phone: [
          { required: true, message: "手机号能为空", trigger: "blur" },
          { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: "请输入有效电话号码", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "用户账号不能为空", trigger: "blur" },
          { min: 3, message: "用户账号不能短于3个字符", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
          { min: 3, message: "用户名不能短于3个字符", trigger: "blur" },
        ],
        email:[
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: "请输入有效的邮箱地址", trigger: "blur" },
        ],
      },
      isEdite: false,
      roleSelectBoxItem:[]
    }
  },
  methods:{
    getUserRoleListByPage(){
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
        .get(
          `/Account/GetUserRoleListByPage`,
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
    getCurrentPageIndex(item) {
      this.search.pageIndex = item;
      this.getUserRoleListByPage();
    },
    handleChange(item) {
      this.search.pageSize = item;
      this.getUserRoleListByPage();
    },
    getUserGender(index){
      switch (index) {
        case 1:
          return "男"
        case 2:
          return "女"
        default:
          return "未知"
      }
    },
    // 重新搜索数据列表集合
    research() {
      if (this.searchMark) {
        window.clearTimeout(this.searchMark);
        this.searchMark = null;
      }
      this.searchMark = window.setTimeout(() => {
        this.getUserRoleListByPage();
      }, 1000);
    },
    // 调整启用状态
    changeIsEnable(kid, statu){
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
      .put(
        `/Account/UpdateUserIsEnable`,
        { kid:kid, isEnable:statu }
      )
      .then(({ code, message }) => {
        this.$showMessage(code, message, ()=>{
          if (code == 200) {
            this.getUserRoleListByPage();
          }
        })
        loading.close();
      });
    },
    // 编辑用户信息
    editeUserInformation(row){
      this.form = row;
      this.isEdite = true;
      this.form.roleByGid = row.roleByGid.split(',');
      this.form.userAvatarUrl = row.userAvatarUrl;
      this.form.userGender = row.userGender + ''
      this.form.userName = row.userName
      this.isShowEditeUserInfo = true;
    },
    // 删除用户
    deleteUser(kid){
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
      .delete(
        `/Account/DeleteUserByVirtual`,
       {params: { kid:kid }}
      )
      .then(({ code, message }) => {
        this.$showMessage(code, message, ()=> {
          if (code == 200) {
            this.getUserRoleListByPage();
          }
        })
        loading.close();
      });
    },
    // 新增用户
    inseartUser(){
      this.isEdite = false;
      this.form = {};

      this.isShowEditeUserInfo = true;
    },
    // 提交表单
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = ElLoading.service({
            fullscreen: false,
            text: "服务连接中......",
            background: "rgba(0, 0, 0, 0.8)",
          });
          this.$http
            .post(
              `/Account/UpdateUserInformationByUser`,
              { ...this.form }
            )
            .then(({ code, message }) => {
              this.$showMessage(code, message, ()=> {
                this.getUserRoleListByPage();
                this.isShowEditeUserInfo = false;
              })
              loading.close();
            });
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    getUserRolesSelectBox(){
      this.$http
        .get(
          `/Account/GetUserRolesSelectBox`
        )
        .then(({ data, code }) => {
          if (code == 200) {
            this.roleSelectBoxItem = data;
          }
        });

    }
  },
  mounted(){
    this.getUserRoleListByPage();
    this.getUserRolesSelectBox();
  }
}
</script>

<style>

</style>