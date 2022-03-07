<template>
  <div class="layout">
    <!-- 菜单栏模块 -->
    <el-row>
      <el-col class="layout-menu" style="">
        <el-menu
          active-text-color="var(--select-item-color)"
          background-color="#545c64"
          :default-active="$route.path"
          text-color="#fff"
          router
        >
          <el-menu-item index="/"  >
            <el-icon><home-filled /></el-icon>
            <span class="none-select">主页</span>
          </el-menu-item>
          <el-sub-menu index="/materialPurchase">
            <template #title>
              <el-icon><home-filled /></el-icon>
              <span>物资购买</span>
            </template>
            <el-menu-item index="/materialPurchase/purchaseMaterials" >
              <el-icon><shopping-cart /></el-icon>
              <span class="none-select">待购物资</span>
            </el-menu-item>
            <el-menu-item index="/materialPurchase" >
              <el-icon><shopping-cart /></el-icon>
              <span class="none-select">发布待购</span>
            </el-menu-item>
            <el-menu-item index="/materialPurchase/AlreadyBought" >
              <el-icon><shopping-cart /></el-icon>
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
          <!-- <el-sub-menu index="2">
            <template #title>
              <el-icon><home-filled /></el-icon>
              <span>生活事务</span>
            </template>
            <el-menu-item index="2-1" @click="clickMenu">物质购买</el-menu-item>
            <el-menu-item index="2-2" @click="clickMenu">车贷还款</el-menu-item>
            <el-menu-item index="2-3" @click="clickMenu">节日度假</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><office-building /></el-icon>
              <span>工作事务</span>
            </template>
            <el-menu-item index="3-1">项目工程</el-menu-item>
            <el-menu-item index="3-2">工作计划</el-menu-item>
            <el-menu-item index="3-3">进度管理</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><reading /></el-icon>
              <span>学习事务</span>
            </template>
            <el-menu-item index="4-1">当前事务</el-menu-item>
            <el-menu-item index="4-2">新增事务</el-menu-item>
            <el-menu-item index="4-3">事务管理</el-menu-item>
          </el-sub-menu> -->
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
import {
  ArrowDownBold,
  Reading,
  OfficeBuilding,
  HomeFilled,
  ShoppingCart,
  Money,
  Flag,
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
       // 活动菜单栏
      activeIndex: "/",
      userInfo: "test"
    }
  },
  methods:{
    // 获取用户信息
    getUserInfo() {
      this.axios
        .get(this.axios.default.baseURL + "/Account/GetUserInfomation")
        .then(({data, code}) => {
            if (code == 200) {
              this.userInfo = data;
            }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted(){
    this.getUserInfo();
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
    width: 200px;
    background: #545c64;
    position: sticky;
    top: 0;
    .el-menu {
      border: none;
    }
  }

  // 内容页布局
  .layout-page {
    width: calc(100% - 200px);

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