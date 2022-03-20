<template>
  <Layout>
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