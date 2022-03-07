<template>
  <el-row>
    <el-col  style="height:100vh;width:260px;background:#545c64">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        default-active="1"
        text-color="#fff"
      >
      <el-sub-menu index="1">
          <template #title>
            <span>主页</span>
          </template>
      </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><home-filled /></el-icon>
            <span>生活事务</span>
          </template>
          <el-menu-item index="1-1">当前事务</el-menu-item>
          <el-menu-item index="1-2">新增事务</el-menu-item>
          <el-menu-item index="1-3">事务管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><office-building /></el-icon>
            <span>工作事务</span>
          </template>
          <el-menu-item index="2-1">当前事务</el-menu-item>
          <el-menu-item index="2-2">新增事务</el-menu-item>
          <el-menu-item index="2-3">事务管理</el-menu-item>
        </el-sub-menu>
         <el-sub-menu index="4">
          <template #title>
            <el-icon><reading /></el-icon>
            <span>学习事务</span>
          </template>
          <el-menu-item index="3-1">当前事务</el-menu-item>
          <el-menu-item index="3-2">新增事务</el-menu-item>
          <el-menu-item index="3-3">事务管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import {
  Reading,
  OfficeBuilding,
  HomeFilled,
  Menu as IconMenu,
} from "@element-plus/icons";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    Reading,
    OfficeBuilding,
    HomeFilled,
    IconMenu,
  },
  setup() {
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    return {
      handleOpen,
      handleClose,
    };
  },
});
</script>
<style scoped>
.el-menu{
    border:none;
}
</style>
