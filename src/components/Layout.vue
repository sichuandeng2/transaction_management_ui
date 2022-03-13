<template>
  <div class="layout">
    <!-- 菜单栏模块 -->
    <el-row>
      <el-col class="layout-menu">
        <el-menu
          active-text-color="var(--select-item-color)"
          background-color="#545c64"
          :default-active="navLeftActive"
          text-color="#fff"
          router
          mode="vertical"
          collapse
        >
          <el-menu-item index="/">
            <el-icon><home-filled /></el-icon>
            <span class="none-select">主页</span>
          </el-menu-item>
          <el-sub-menu  index="/materialPurchase">
            <template #title>
              <el-icon :class="{'select-sub-menu' : isSelectSubMenu}"><Goods /></el-icon>
              <span>物资购买</span>
            </template>
            <el-menu-item index="/materialPurchase/index" >
              <el-icon><Bell/></el-icon>
              <span class="none-select">发布待购</span>
            </el-menu-item>
            <el-menu-item index="/materialPurchase/purchaseMaterials" >
              <el-icon><shopping-cart /></el-icon>
              <span class="none-select">待购物资</span>
            </el-menu-item>
            <el-menu-item index="/materialPurchase/AlreadyBought" >
              <el-icon><List /></el-icon>
              <span class="none-select">我的购买</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/projectManagement" >
            <el-icon><money /></el-icon>
            <span class="none-select">项目管理</span>
          </el-menu-item>
          <el-menu-item index="/plan" >
            <el-icon><flag /></el-icon>
            <span class="none-select">计划</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <!-- 右侧模块 -->
    <div class="layout-page">
      <!-- 右侧头部内容 -->
      <div class="layout-page-header">
        <div class="header-inner">
          <el-input v-model="search" placeholder="搜索"></el-input>
          <el-popover placement="bottom-end" :width="200" trigger="hover">
            <template #reference>
              <div class="aviter">
                <el-avatar :size="40" :src="circleUrl"></el-avatar>
                <div class="none-select">{{userInfo.nickName}}</div>
              </div>
            </template>
            <div class="avatarInfo">
              <div @click="exit" class="none-select">退出</div>
              <div class="none-select">编辑个人信息</div>
            </div>
          </el-popover>
        </div>
        <!-- <el-divider></el-divider> -->
        <!-- <el-breadcrumb :separator-class="'<el-icon><home-filled /></el-icon>'">
          <el-breadcrumb-item :to="{ path: '/' }">当前位置：主页</el-breadcrumb-item>
          <slot name="elBreadcrumb"></slot>
        </el-breadcrumb> -->
       
      </div>
      <!-- 插槽内容 -->
      <div class="layout-page-inner">
        <slot name="inner"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, toRefs, reactive, useRouter } from "vue";
import { ElLoading } from "element-plus";
import {
  ArrowDownBold,
  Reading,
  OfficeBuilding,
  HomeFilled,
  ShoppingCart,
  Money,
  Flag,
  Goods,
  List,
  Bell,
  Menu as IconMenu,
} from "@element-plus/icons";

export default defineComponent({
  components: {
    Reading,
    OfficeBuilding,
    HomeFilled,
    IconMenu,
    ArrowDownBold,
    ShoppingCart,
    Money,
    Flag,
    Bell,
    List,
    Goods,
    ElLoading
  },
  setup() {
    const state = reactive({
      circleUrl: "http://127.0.0.1:8080/avatar.jpg",
    });
    const exit = () => {
      localStorage.clear("token");
      window.location.href = "/login";
    };
    return {
      // 退出登录
      exit,
      // 搜索
      search: ref(""),
      // 状态保持
      ...toRefs(state),
    };
  },
  data(){
    return {
      userInfo: "test",
      isSelectSubMenu: false
    }
  },
  methods:{
    
    // 获取用户信息
    getUserInfo() {
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
        .get("/Account/GetUserInfomation")
        .then(({data, code}) => {
            if (code == 200) {
              this.userInfo = data;
            }
            loading.close();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted(){
    this.getUserInfo();
  },
  computed:{
    navLeftActive: function (){
      const {meta, path} = this.$route;
      if(meta.activeMenu == "/materialPurchase"){
        this.isSelectSubMenu = true;
      }
      else{
        this.isSelectSubMenu = false
      }
      return path;
    }
  },
  name: "Layout",
});
</script>
<style lang="scss" scoped>
.layout {
  display: flex;
  background-color: #eeeeee;
  .layout-menu {
    height: 100vh;
    width: 64px;
    background: #545c64;
    position: sticky;
    top: 0;
    .select-sub-menu{
      color: var(--select-item-color);
    }
    .el-menu {
      border: none;
    }
  }

  // 内容页布局
  .layout-page {
    width: calc(100% - 64px);

    // 页头
    .layout-page-header {
      padding: 10px;
      background-color: #ffffff;
      box-shadow: 0px 8px 5px #cccccc;
      position: sticky;
      top: 0;
      z-index: 990;

      .header-inner {
        padding-right: 30px;
        display: flex;
        justify-content: space-between;

        .el-input {
          width: 200px;
          float: left;
        }
      }
      // 横线
      .el-divider {
        margin: 10px 0px;
      }
      // 面包屑
      .el-breadcrumb {
        margin: 10px 0px 0px 0px;
        font-size: 14px;
      }
      // 头像区域
      .aviter{
        // border:1px solid red;
        display: flex;
        align-items: center;
        div {
          margin:0px 5px;
        }
      }
    }

    // 插槽内容
    .layout-page-inner {
      margin: 10px;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 5px 14px 9px #cccccc;
      background-color: white;
      height: calc(100% - 80px);
    }
  }
}
.avatarInfo > div {
  font-size: 14px;
  padding: 5px 5px;
}
.avatarInfo > div:hover {
  color: var(--select-item-color);
  background-color: var(--select-background-color);
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
</style>
<style scoped>
.header-inner .el-input /deep/ .el-input__inner {
  height: 28px;
}
</style>