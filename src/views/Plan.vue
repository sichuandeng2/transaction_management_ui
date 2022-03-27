<template>
  <Layout>
    <template v-slot:inner>
      <p>this is plan</p>
      <el-table :data="tableData" highlight-current-row>
        <el-table-column prop="gid" label="序号" width="50">
          <template #default="scope">
            {{ ++scope.$index }}
          </template>
        </el-table-column>
        <el-table-column prop="planName" label="计划名称" width="180" />
        <el-table-column prop="planType" label="计划类型" width="120" />
        <el-table-column prop="cycleType" label="周期类别" width="80" />
        <el-table-column prop="cycleTime" label="周期时间" width="80" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" @click="editPlan(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
      </el-table>
    </template>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
import { ElLoading, ElMessageBox, UploadUserFile, UplodaFile } from "element-plus";
export default {
  name: 'plan',
  components:{
    Layout,
    ElMessageBox
  },
  data(){
    return {
      search:{
        planName: '',
        cycleType: 0,
        planType: 0
      },
      tableData: {},
      count: 0,
    }
  },
  methods:{
    getPlanListByPage(){
      this.$http
      .get(
        `/plan/getPlanListByPage`,
        { params: { ...this.search } }
      )
      .then(({ data, code, message, count }) => {
        if (code == 200) {
          console.log(data);
          this.tableData = data;
          this.count = count;
        }
        this.$showMessage(code, message);
      });
    },
    editPlan(){

    }
  },
  mounted(){
    console.log("start")
    this.getPlanListByPage();
  }
}
</script>

<style>

</style>