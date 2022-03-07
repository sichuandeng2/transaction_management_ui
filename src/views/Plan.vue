<template>
  <Layout>
    <template v-slot:elBreadcrumb>
      <el-breadcrumb-item :to="{ path: '/plan' }">计划</el-breadcrumb-item>
    </template>
    <template v-slot:inner>
        <p>this is plan</p>
    </template>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
export default {
    name: 'plan',
    components:{
        Layout
    }
}
</script>

<style>

</style>