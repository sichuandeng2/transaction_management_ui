<template>
    <Layout>
        <template v-slot:inner>
            <div>
                <h1>个人信息</h1>
                <div class="info">
                    <el-avatar :size="40" :src="userInfomation.userAvatarUrl">{{userInfomation.userAvatarUrl==''?"添加":""}}</el-avatar>
                    <div class="none-select">{{userInfomation.nickName}}</div>
                    <p>账号：{{userInfomation.userName}}</p>
                    <p>用户名：{{userInfomation.nickName}}</p>
                    <p>角色: {{userInfomation.roles == null ? '未知' : userInfomation.roles}}</p>
                    <p>性别：{{userInfomation.userGender == 1 ? '男' : '女'}}</p>
                    <p>电话：{{userInfomation.phone == null ? '未知': userInfomation.phone}}</p>
                    <p>邮箱：{{userInfomation.email == null ? '未知' : userInfomation.email}}</p>
                    <p>QQ: {{userInfomation.qq == null ? '未知': userInfomation.qq}}</p>
                    <p>微信：{{userInfomation.wechat == null ? '未知' : userInfomation.wechat}}</p>
                </div>
                <el-button type="primary" @click="editeUser">编辑</el-button>
            </div>
        </template>
    </Layout>
			<!-- 编辑弹出层 -->
      <el-dialog title="编辑" v-model="isShowEditeUserInfo" width="680px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div  @click="this.isSelectClient = true" class="cursor-pointer" >
            <el-form-item label="头像" prop="userGid">
              <el-avatar :size="40" :src="form.userAvatarUrl" >{{form.userAvatarUrl==''?"添加":""}}</el-avatar>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="用户昵称"
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
          </div>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
            <el-button @click="isShowEditeUserInfo = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
</template>

<script>
import Layout from "../../components/Layout.vue";
import { ElLoading } from "element-plus";
export default {
    name:"personal",
    components:{
        Layout
    },
    data(){
        return{
            name: 'developer',
            userInfomation: {
                avater: "",
                userName: '',
                phone: '',
                email: '',
            },
						isShowEditeUserInfo: false,
						form: {},// 对表单的验证规则
						rules: {
							qq: [
								{ pattern: /^[1-9][0-9]{4,14}$/, message: '请输入有效的QQ账号' }
							],
							phone: [
								{ required: true, message: "手机号能为空", trigger: "blur" },
								{ pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: "请输入有效电话号码", trigger: "blur" },
							],
							nickName: [
								{ required: true, message: "用户昵称不能为空", trigger: "blur" },
								{ min: 3, message: "用户名不能短于3个字符", trigger: "blur" },
							],
							email:[
								{ pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: "请输入有效的邮箱地址", trigger: "blur" },
							],
						},
        }
    },
    mounted(){
			this.form = this.userInfomation = JSON.parse(sessionStorage["userInfomation"])
    },
		methods:{
			editeUser(){
				this.userInfomation.userGender = this.userInfomation.userGender + ''
				this.isShowEditeUserInfo = true
			},
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
              `/Account/UpdateUserInfomation`,
              { ...this.form }
            )
            .then(({ code, message }) => {
              if (code == 200) {
                this.$message({
                  message: this.operateName + "成功",
                  type: "success",
                  duration: 500,
                  onClose: () => {
										sessionStorage["userInfomation"] = JSON.stringify(this.userInfomation)
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
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
			}
		}
    
}
</script>

<style>
    .info{
        margin-left: 28px;
        text-align: left;
    }
</style>