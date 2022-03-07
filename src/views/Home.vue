<template>
  <Layout>

    <template v-slot:inner>
      <div class="home">
      <div>
        <el-input v-model="search" placeholder="请输入事务名称" />
      </div>
      <el-table :data="tableData">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
    </template>
  </Layout>
</template>

<script>
// @ is an alias to /src
import Layout from "@/components/Layout.vue";

export default {
  name: "Home",
  components: {
    Layout,
  },
  data() {
    return {
      search: "",
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-02",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-04",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-01",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
      ],
    };
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      this.axios
        .get(this.axios.default.baseURL + "/Account/GetUserInfomation")
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    // this.getUserInfo()
    // var token = localStorage["token"];
    // if (token == null || token == undefined || token == "") {
    //   this.$router.push("/login");
    // }
  },
};
</script>
<style lang="scss" scoped>
.home {
  // padding: 10px;
  height: 800px;
}
</style>