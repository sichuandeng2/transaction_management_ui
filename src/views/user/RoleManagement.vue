<template>
  <Layout>
    <template v-slot:inner>
      <div style="display: flex; justify-content: space-between">
        <el-form label-width="80px" style="display: flex">
          <el-form-item label="角色">
            <el-input
              v-model="search.roleName"
              v-on:input="research"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="inseartUser" style="height: 16px">新增角色</el-button>
      </div>
      <el-table :data="tableData" highlight-current-row max-height="calc( 100vh - 225px)" style="overflow-y: scroll;">
        <el-table-column prop="kid" label="序号" width="50">
          <template #default="scope">
            {{ ++scope.$index }}
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色" width="120" show-overflow-tooltip />
        <el-table-column prop="authorityByKid" label="授权" width="320" show-overflow-tooltip >
          <template #default="scope">
            {{ getAutorityName(scope.row.authorityByKid) }}
          </template>
        </el-table-column>
        <el-table-column prop="kid" label="状态" width="50">
          <template #default="scope">
            {{ scope.row.isEnable ? "启用":"停用" }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip />
          <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" v-if="!scope.row.isEnable"  @click="changeIsEnable(scope.row.kid, true)">启用</el-button>
                <el-button type="text" :disabled="scope.row.roleName== 'admin'" v-else @click="changeIsEnable(scope.row.kid, false)">禁用</el-button>
                <el-button type="text" @click="editeRoleInformation(scope.row)">编辑</el-button>
                <el-button type="text" :disabled="scope.row.roleName== 'admin'" @click="deleteRole(scope.row.kid)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div style="text-align: right; padding-right: 23px; padding-top: 20px">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          @current-change="getCurrentPageIndex"
          @size-change="handleChange"
          :page-size="search.pageSize"
          :page-sizes="[10, 20, 50, 999]"
          :total="count"
        ></el-pagination>
      </div>
      <!-- 编辑弹出层 -->
		<el-dialog :title="(isEdite ? '编辑': '新增') + '角色'" v-model="isShowEditeRoleInfo" width="680px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="角色" prop="roleName">
            <el-input
              v-model="form.roleName"
              placeholder="请输入角色名称"
              :disabled="form.roleName== '开发人员'"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限" v-show="form.roleName !='开发人员'">
            <el-tree
              :data="authorizationTree"
              show-checkbox
              v-model="selectThree"
              node-key="id"
              accordion
              ref = "tree"
              :default-checked-keys="form.authorityByKid"
              :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="onSubmit('form')">提交</el-button>
            <el-button @click="isShowEditeRoleInfo = false">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    </template>
  </Layout>
</template>

<script>
import Layout from "../../components/Layout.vue";
import { ElLoading } from "element-plus";
import { ref } from 'vue'
export default {
  name: "roleManage",
  components:{
    Layout
  },
  data(){
    return {
      tableData: [],
      search: {
        roleName: "",
        pageSize: 10,
        pageIndex: 1
      },
      isShowEditeRoleInfo: false,
      form:{
        kid: null,
        authorityByKid:[],
        roleName: "",
        remark: ""
      },
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          { min: 2, message: "用户账号不能短于2个字符", trigger: "blur" },
        ],
      },
      isEdite: false,
      selectAuthorizationBoxItem:[],
      authorizationTree:[],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectThree:[],
      count: 0,
    }
  },
  methods:{
    getUserRoleListByPage(){
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
        .get(
          `/Account/GetUserRoleListByPage`,
          { params: { ...this.search } }
        )
        .then(({ data, code, message, count }) => {
          if (code == 200) {
            this.tableData = data;
            this.count = count;
          }
          loading.close();
          this.$showMessage(code, message);
        });
    },
    getCurrentPageIndex(item) {
      this.search.pageIndex = item;
      this.getUserRoleListByPage();
    },
    handleChange(item) {
      this.search.pageSize = item;
      this.getUserRoleListByPage();
    },
    // 重新搜索数据列表集合
    research() {
      if (this.searchMark) {
        window.clearTimeout(this.searchMark);
        this.searchMark = null;
      }
      this.searchMark = window.setTimeout(() => {
        this.getUserRoleListByPage();
      }, 1000);
    },
    // 调整启用状态
    changeIsEnable(kid, statu){
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
      .put(
        `/Account/UpdateRoleIsEnable`,
        { kid:kid, isEnable:statu }
      )
      .then(({ code, message }) => {
        this.$showMessage(code, message, ()=>{
          if (code == 200) {
            this.getUserRoleListByPage();
          }
        })
        loading.close();
      });
    },
    // 编辑角色信息
    editeRoleInformation(row){
      this.isEdite = true;
      this.form.kid = row.kid
      this.form.authorityByKid = row.authorityByKid.split(',');
      if(this.$refs.tree)this.$refs.tree.setCheckedKeys( row.authorityByKid.split(','))
      this.form.remark = row.remark;
      this.form.roleName = row.roleName
      this.isShowEditeRoleInfo = true;
    },
    // 删除角色
    deleteRole(kid){
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
      .delete(
        `/Account/DeleteRoleInforamation`,
       {params: { kid:kid }}
      )
      .then(({ code, message }) => {
        this.$showMessage(code, message, ()=> {
          if (code == 200) {
            this.getUserRoleListByPage();
          }
        })
        loading.close();
      });
    },
    // 新增角色
    inseartUser(){
      this.isEdite = false;
      this.form = {};

      this.isShowEditeRoleInfo = true;
    },
    // 提交表单
    onSubmit(formName){
      this.form.authorityByKid = this.$refs.tree.getCheckedKeys()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = ElLoading.service({
            fullscreen: false,
            text: "服务连接中......",
            background: "rgba(0, 0, 0, 0.8)",
          });
          this.$http
          .put(
            `/Account/UpdateRoleInforamation`,
            { ...this.form }
          )
          .then(({ code, message }) => {
            this.$showMessage(code, message, ()=> {
              this.getUserRoleListByPage();
              this.isShowEditeRoleInfo = false;
            })
            loading.close();
          });
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    GetAuthorizationTree(){
      this.$http
      .get(
        `/Account/GetAuthorizationTree`
      )
      .then(({ data, code }) => {
        if (code == 200) {
          this.authorizationTree = data;
        }
      });
    },
    getAutorityName(kids){
      let authNames = [];
      let treeNode =this.authorizationTree;
      treeNode.forEach(element => {
       let node = element.children;
        node.forEach(e => {
          if(kids.includes(e.id)) authNames.push(e.label);
        })
      });
      return authNames.join(',')
    }
  },
  mounted(){
    this.GetAuthorizationTree();
    this.getUserRoleListByPage();
  }
}
</script>

<style>

</style>