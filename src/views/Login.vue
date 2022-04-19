<template>
  <div class="login">
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-form ref="form" :model="form" label-width="80px">
            <h2 class="none-select">{{ title }}</h2>
            <el-input
              v-model="form.account"
              placeholder="请输入用户名"
            ></el-input>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
            ></el-input>
            <div>
              <el-input
                v-model="form.validateCode"
                placeholder="请输入验证码"
                style="width: calc(100% - 80px)"
                @keydown="knobEnter"
              ></el-input>
              <el-image
                :src="path"
                alt="验证码"
                style="
                  width: 80px;
                  height: 40px;
                  vertical-align: middle;
                  border-radius: 6px;
                  border: none;
                "
              ></el-image>
            </div>
            <el-button type="primary" @click="submitForm()">登录</el-button>
            <el-button>取消</el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus'
export default {
  name: "login",
  components:{
    ElLoading,
  },
  data() {
    return {
      form: {
        account: "",
        password: "",
        validateCode: "",
      },
      title: "事务管理系统",
      path: this.$http.baseURL+"/Account/GetValidateCode",
    };
  },
  methods: {
    // 点击回车键登录用户
    knobEnter(e) {
      if (e.keyCode == 13) {
        this.submitForm();
      }
    },
    // 登录
    submitForm() {
      // 用户名不能为空
      if (this.form.account.trim() == "") {
        this.$message({
          message: "用户名不能为空",
          type: "warning",
          duration: 1500,
        });
        return;
      }
      // 密码不能为空
      if (this.form.password.trim() == "") {
        this.$message({
          message: "密码不能为空",
          type: "warning",
          duration: 1500,
        });
        return;
      }
      // 验证码不能为空
      if (this.form.validateCode.trim() == "") {
        this.$message({
          message: "验证码不能为空",
          type: "warning",
          duration: 1500,
        });
        return;
      }

      // var formdata = new FormData();
      // formdata.append("userName", this.form.account);
      // formdata.append("password", this.form.password);
      // formdata.append("validateCode", this.form.validateCode);
      var params = {
        userName:this.form.account,
        userPassword: this.form.password,
        validateCode:this.form.validateCode,
      }
      const loading = ElLoading.service({ fullscreen: true, fullscreen: false, text: "服务请求中......",background:"rgba(0, 0, 0, 0.8)" })
      // console.log(this.$http.get("/Account/Login",{params}))
      
      this.$http
        .get("/Account/Login", {params})
        .then(({message, code, data}) => {
          this.$showMessage(code, message, ()=>{
            if(code == 1000){
              localStorage["token"] = data;
              this.$router.push("/");
            }
          });
          this.path = this.$http.baseURL + "/Account/GetValidateCode?t=" + new Date().getTime();
          this.form.validateCode = ''
          loading.close();
        })
        .catch((err) => {
          console.log(err)
          // loading.close();
        });
        loading.close();
    },
  },
  mounted() {
    var token = localStorage["token"];
    if (token == null || token == undefined || token == "") {
      return;
    }
    this.$router.push("/");
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  width: 100vw;
  background-size: 100% 100%;
  background-image: url(../assets/backgroundImg.jpg);
  h2 {
    margin-bottom: 15px;
    color: #f2f6fc;
  }
  .el-row {
    width: 395px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .el-card {
    background-color: #303133;
    border-color: #666666;
  }
  .el-card.is-always-shadow {
    box-shadow: 2px 2px 10px #999999;
  }
  .el-input {
    margin: 10px auto;
  }

  .el-input >>> input {
    background-color: #606366;
    color: seashell;
    font-size: 16px;
  }
  .el-button {
    font-size: 16px;
  }
}
</style>