<template>
  <Layout>
    <template v-slot:inner>
      <div style="display: flex; justify-content: space-between">
        <el-form label-width="80px" style="display: flex">
          <el-form-item label="用户名">
            <el-input
              v-model="search.userName"
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
        <el-table-column prop="userName" label="用户名" width="120" show-overflow-tooltip />
        <!-- <el-table-column prop="nickName" label="昵称" width="120" show-overflow-tooltip /> -->
				<el-table-column prop="userGender" label="性别" width="80" show-overflow-tooltip >
					<template #default="scope">
						{{getUserGender(scope.row.userGender)}}
					</template>
				</el-table-column>
        <el-table-column prop="roles" label="角色" width="160" show-overflow-tooltip >
					<template #default="scope">
						{{scope.row.roles.join(',')}}
					</template>
				</el-table-column>
        <el-table-column prop="phone" label="手机" width="160" show-overflow-tooltip />
        <!-- <el-table-column prop="wechat" label="微信" width="160" show-overflow-tooltip /> -->
        <el-table-column prop="email" label="邮箱" width="160" show-overflow-tooltip />
				<el-table-column prop="lastLoginTime" label="最后登录" />
				<el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" v-if="!scope.row.isEnable"  @click="changeIsEnable(scope.row.kid, true)">启用</el-button>
                <el-button type="text" :disabled="scope.row.userName =='admin'" v-else @click="changeIsEnable(scope.row.kid, false)">禁用</el-button>
                <el-button type="text" @click="editeUserInformation(scope.row)">编辑</el-button>
                <el-button type="text" :disabled="scope.row.userName =='admin'"  @click="deleteUser(scope.row.kid)">删除</el-button>
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
                  :action="$http.baseURL + '/Account/UploadAvatarByUser'"
                  :headers="customHeaders"
                  :limit="1"
                  :data="{kid:form.kid}"
                >
                  <template #trigger>
                    <el-avatar :size="60" :src="$http.baseURL + form.userAvatarUrl">{{form.userAvatarUrl==''?"添加":""}}</el-avatar>
                  </template>
                  <el-button class="ml-3" type="success" style="display:none">
                    upload to server
                  </el-button>
                </el-upload>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="账号" prop="userName" >
              <el-input
                :disabled="isEdite"
                v-model="form.userName"
                placeholder="登录账号"
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
            <el-form-item label="昵称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="用户昵称"
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
            <el-form-item label="手机" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号码"
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
        userName: "",
        pageSize: 10,
        pageIndex: 1
      },
      isShowEditeUserInfo: false,
      form:{
        kid: null,
        roleByGid:[],
        userGender:'0',
      },
      rules: {
        qq: [
          { pattern: /^[1-9][0-9]{4,14}$/, message: '请输入有效的QQ账号' }
        ],
        phone: [
          // { required: true, message: "手机号能为空", trigger: "blur" },
          { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: "请输入有效电话号码", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "用户账号不能为空", trigger: "blur" },
          { min: 3, message: "用户账号不能短于3个字符", trigger: "blur" },
        ],
        // nickName: [
        //   { required: true, message: "用户昵称不能为空", trigger: "blur" },
        //   { min: 3, message: "用户名不能短于3个字符", trigger: "blur" },
        // ],
        email:[
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: "请输入有效的邮箱地址", trigger: "blur" },
        ],
      },
      isEdite: false,
      roleSelectBoxItem:[],
      customHeaders:{
          authorization:"bearer " + localStorage["token"]
      },
      count: 0,
    }
  },
  methods:{
    getUserInformationListByPage(){
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
        .get(
          `/Account/getUserInformationListByPage`,
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
      this.getUserInformationListByPage();
    },
    handleChange(item) {
      this.search.pageSize = item;
      this.getUserInformationListByPage();
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
        this.getUserInformationListByPage();
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
            this.getUserInformationListByPage();
          }
        })
        loading.close();
      });
    },
    // 编辑用户信息
    editeUserInformation(row){
      this.isEdite = true;
      this.form.roleByGid = !!row.roleByGid? row.roleByGid.split(','): [];
      // console.log(this.form.roleByGid)
      this.form.userAvatarUrl = row.userAvatarUrl;
      this.form.userGender = row.userGender + ''
      this.form.userName = row.userName
      this.form.kid = row.kid
      this.form.email = row.email
      this.form.phone = row.phone
      this.form.qq = row.qq
      this.form.wechat = row.wechat
      this.form.nickName = row.nickName
      this.form.remark = row.remark
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
            this.getUserInformationListByPage();
          }
        })
        loading.close();
      });
    },
    // 新增用户
    inseartUser(){
      this.isEdite = false;
      this.form = {
        userGender: '0'
      };

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
                this.getUserInformationListByPage();
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
    this.getUserInformationListByPage();
    this.getUserRolesSelectBox();
  }
}
</script>

<style>

</style>