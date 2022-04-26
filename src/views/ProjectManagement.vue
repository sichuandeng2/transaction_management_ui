<template>
  <Layout>
    <template v-slot:elBreadcrumb>
      <el-breadcrumb-item :to="{ path: '/web/projectManagement' }">项目管理</el-breadcrumb-item>
    </template>
    <template v-slot:inner>
        <p>this is project Management</p>
    </template>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
export default {
    name: 'projectManagement',
    components:{
        Layout
    }
}
</script>

<style>

</style>