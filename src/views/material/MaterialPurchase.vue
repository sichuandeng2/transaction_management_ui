<template>
  <Layout>
    <!-- 页面内容 -->
    <template v-slot:inner>
      <!-- 筛选区域 -->
      <div style="display: flex; justify-content: space-between">
        <el-form :model="form" label-width="80px" style="display: flex">
          <el-form-item label="物质名称">
            <el-input v-model="search.materialName" v-on:input="research"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="search.status" placeholder="请选择" v-on:change="research" filterable v-on:blur="selectBlur" >
              <el-option label="全部" value="0"></el-option>
              <el-option label="待购" value="1"></el-option>
              <el-option label="已购" value="2"></el-option>
              <el-option label="作废" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="
            dialogVisible = true;
            operateName = '新增';
            this.form.kid = '';
          "
          style="height: 16px"
          >新增物资</el-button
        >
      </div>
      <el-divider class="hir-line"></el-divider>
      
      <el-table :data="tableData" highlight-current-row @current-change="getCurentRow" :row-class-name="classStatus" height="calc( 100vh - 225px)" >
        <el-table-column prop="kid" label="序号" width="50" >
          <template #default="scope">
            {{++scope.$index}}
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="物资名称" width="180" />
        <el-table-column prop="modelNumber" label="物资型号" width="120" />
        <el-table-column prop="quantityRequired" label="数量" width="80" />
        <el-table-column prop="unitPrice" label="单价" width="80" />
        <el-table-column prop="precedenceLevel" label="优先级" width="120">
        </el-table-column>
        <el-table-column prop="createTime" label="发布日期" width="150" ></el-table-column>
        <el-table-column prop="status" label="状态" width="80" />
        <el-table-column prop="suggestLocation" label="建议地点" />
      </el-table>

      <!-- 分页器 -->
      <div style="text-align: right; padding-right:23px; padding-top:20px;">
        <el-pagination background layout="sizes, prev, pager, next" @current-change="getCurrentPageIndex" @size-change="handleChange" :page-size="search.pageSize" :page-sizes="[10,20,50,999]" :total="count"></el-pagination>
      </div>

      <!-- 编辑弹出层 -->
      <el-dialog title="新增" v-model="dialogVisible" width="680px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div  @click="this.isSelectClient = true" class="cursor-pointer" >
            <el-form-item label="委托" prop="userGid">
              <el-avatar :size="40" :src="$http.baseURL + form.userInfo.userAvatarUrl" >{{form.userInfo.userAvatarUrl==''?"添加":""}}</el-avatar>
              <div class="none-select">{{form.userInfo.nickName}}</div>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="物质名称" prop="materialName">
              <el-input
                v-model="form.materialName"
                placeholder="请输入物品名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="物质类型">
              <el-input
                v-model="form.modelNumber"
                placeholder="请输入物品型号"
              ></el-input>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="购买数量" prop="quantityRequired">
              <el-input
                v-model.number="form.quantityRequired"
                placeholder="请输入数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="建议金额" prop="unitPrice">
              <el-input v-model="form.unitPrice" placeholder="0.00">
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="建议地点">
            <el-input
              v-model="form.suggestLocation"
              placeholder="请输入建议地点"
            ></el-input>
          </el-form-item>
          <div style="display: flex">
            <el-form-item label="优先级">
              <el-radio-group v-model="form.precedenceLevel">
                <el-radio label="重要且紧急">重要且紧急</el-radio>
                <el-radio label="不重要但紧急">不重要但紧急</el-radio>
                <el-radio label="重要但不急">重要但不急</el-radio>
                <el-radio label="不重要也不急">不重要也不急</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 选择委托人弹出层 -->
      <SelectClient v-model="isSelectClient"></SelectClient>
      <!-- 鼠标右键上下文菜单栏 -->
      <div id="operation" v-bind:class="[ isShowContextMenu ? 'showContext' : 'hideContext' ]">
        <div class="operate" @click="clickMenu('', 1)">编辑</div>
        <div class="operate" @click="clickMenu('', 2)">删除</div>
        <div class="operate" @click="clickMenu('', 3)">作废</div>
        <div class="operate" @click="clickMenu('', 4)">已购</div>
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "../../components/Layout.vue";
import { ElLoading, ElMessageBox } from "element-plus";
import {Search,More} from "@element-plus/icons";
import SelectClient from "../../components/SelectClient.vue"
export default {
  name: "materialPurchase",
  components: {
    Layout,
    ElLoading,
    Search,
    More,
    SelectClient
  },
  data() {
    return {
      // 弹出层的显示和隐藏
      dialogVisible: false,
      // 新增或编辑的代购信息
      form: {
        materialName: "",
        ModelNumber: "",
        quantityRequired: 1,
        unitPrice: null,
        suggestLocation: "",
        precedenceLevel: "不重要但紧急",
        remark: "",
        userInfo:{
          nickName: '选择委托人',
          userAvatarUrl: ''
        },
        userGid: ''
      },
      // 获取的待购信息
      tableData: [],
      // 操作名称
      operateName: "",
      // 表格当前选中值
      currentRow: null,
      // 对表单的验证规则
      rules: {
        materialName: [
          { required: true, message: "材料名称不能为空", trigger: "blur" },
          { max: 255, message: "长度不能超过 255 个字符", trigger: "blur" },
        ],
        quantityRequired: [
          { required: true, message: "购置数量不能为空", trigger: "blur" },
          { type: "number", message: "请输入整数", trigger: "blur" },
        ],
        unitPrice: [
          { required: true, message: "购置金额不能为空", trigger: "blur" },
          { pattern: /(^(([1-9]+\d*)|(0{1}))(\.\d{1,2})?$)|(^-([1-9]+\d*(\.\d{1,2})?|0\.(0[1-9]{1}|[1-9]{1}\d?))$)/, message: "请输入金额", trigger: "blur" },
        ],
      },
      // 搜索查询
      search: {
        materialName: "",
        status: "1",
        pageSize: 10,
        pageIndex: 1,
      },
      // 总数量
      count: 0,
      // 搜索标记
      searchMark: null,
      // 是否显示待购事务菜单
      isShowContextMenu: false,
      // 状态样式
      classStatus: ({row})=>{
        if(row.status == "已购") return "row-already-bought";
        if(row.status == "作废") return "row-invalid";
      },
      // 是否显示委托人弹窗
      isSelectClient: false,
      // 搜索委托人
      searchClient:''
    };
  },
  methods: {
    // 获取当前选中行
    getCurentRow(newValue, oldValue){
      this.isShowContextMenu = false
      this.currentRow = newValue;
    },
    // 提交表单信息
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.form.precedenceLevel) {
            case "重要且紧急":
              this.form.precedenceLevel = 1
              break;
            case "不重要但紧急":
              this.form.precedenceLevel = 2
              break;
            case "重要但不急":
              this.form.precedenceLevel = 3
              break;
            case "不重要也不急":
              this.form.precedenceLevel = 4
              break;
            default:
              this.showMessage(500,"系统提示，优先级提交异常。")
              return;
          }
          this.form.status = 0;
          const loading = ElLoading.service({
            fullscreen: false,
            text: "服务连接中......",
            background: "rgba(0, 0, 0, 0.8)",
          });
          this.$http
            .post(
              `/MaterialPurchase/InsertMaterialPurchase`,
              { ...this.form }
            )
            .then(({ data, code, message }) => {
              this.$showMessage(code, message, () => {
                if(code = 200){
                    this.form.precedenceLevel = "不重要但紧急"
                    this.getMaterialPurchase();
                }
              })
              loading.close();
            });
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // 获取待购信息
    getMaterialPurchase() {
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
      .get('/MaterialPurchase/GetMaterialPurchaseByPage',
        { params: { ...this.search }}
      )
      .then(({ data, code, message, count }) => {
        if (code == 200) {
          this.tableData = data;
          this.count = count;
        }
        loading.close()
        this.$showMessage(code, message);
      });
    },
    // 待购信息编辑
    handleEdit(index, item) {
      console.log(index, item);
      this.form = item;
      this.dialogVisible = true;
      this.operateName = "编辑";
       console.log(this.form.userInfo.userAvatarUrl);
    },
    // 删除待购信息
    handleDelete(guid) {
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
        .delete(`/MaterialPurchase/DeleteMaterialPurchase`, { params: { gid: guid } })
        .then(({ code, message }) => {
          this.$showMessage(code, message, ()=> {
             if(code==200) this.getMaterialPurchase();
          })
          loading.close();
        });
    },
    getCurrentPageIndex(item){
      this.search.pageIndex= item;
      this.getMaterialPurchase();
    },
    handleChange(item){
      this.search.pageSize = item;
      this.getMaterialPurchase();
    },
    // 重新搜索数据列表集合
    research(){
      if (this.searchMark) {
        window.clearTimeout(this.searchMark);
        this.searchMark = null;
      }
      this.searchMark = window.setTimeout(()=> {
        this.getMaterialPurchase();
      }, 1000)
      
    },
    showTime(time){
      let date = new Date(time);
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
    // 点击菜单方法
    clickMenu(e,index){
      if (this.currentRow == null) {
        this.$showMessage(500,"系统提示，请先选中需要操作的选项！")
        return;
      }
      if (e != null){
        switch (index) {
          case 1:
            if (this.currentRow.status == "待购") {
              this.handleEdit(1, this.currentRow);
            }else{
              this.$showMessage(500,"系统提示，仅待购物质支持编辑！")
            }
            break;
          case 2:
            this.elAlert("删除", ()=>{
              this.handleDelete(this.currentRow.kid)
            })      
            break;
          case 3:
            if (this.currentRow.status == "待购") {
              this.elAlert("作废", ()=>{
                this.changeStatu(3)
              })
            }else{
              this.$showMessage(500,"系统提示，仅待购物质支持作废操作！")
            }
            break;
          case 4:
            if (this.currentRow.status == "待购") {
              this.elAlert("已购", ()=>{
                this.changeStatu(2)
              })
            }else{
              this.$showMessage(500,"系统提示，仅待购物质支持已购操作！")
            }

            break;
          default:
            break;
        }
        this.isShowContextMenu = false;
      }
    },
    // 修改物资信息状态
    changeStatu(statu){
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http.put(`/MaterialPurchase/ChangeMaterialPurchaseStatus`, {kid:this.currentRow.kid, status:statu})
      .then(({code, message}) => {
        this.$showMessage(code, message, () => {
          if(code == 200) this.getMaterialPurchase(); 
        });
        loading.close();
      })
    }
    ,elAlert(operateName, action){
      ElMessageBox
      .confirm(`您确定 ${operateName} 物质名称为：${this.currentRow.materialName} 的数据吗？`,"系统提示",
        {
          confirmButtonText: "确认", 
          cancelButtonText:"取消",
          type: "warning"
        }
      )
      .then(()=>{action()})
      .catch((action)=>{
        if(action == "cancel") return;
      })
    },
    //搜索判定 
    selectBlur(e){
      switch (e.target.value) {
        case "待购":
          this.search.status = "1";
          break;
        case "已购":
          this.search.status = "2";
          break;
        case "作废":
          this.search.status = "3";
          break;
        case "":
          return;
        default:
          this.search.status = "0";
          break;
      }
      this.search.pageIndex = 1;
      this.getMaterialPurchase();
    },
  },
  mounted() {
    this.getMaterialPurchase();
    let that = this;
    let table = document.getElementsByClassName("el-table__body")[0];
    window.oncontextmenu = function(e){
      // 取消原有右键功能；
      e.preventDefault();
      // 显示上下文菜单
    }
    table.oncontextmenu = function(e){
      e.preventDefault();
      that.isShowContextMenu = true;
    }
  },
};
</script>

<style>
  #operation{
    width: 100px;
    position: fixed;
    top: 50%;
    right: 52px;
    box-shadow: 1px 1px 2px #999999;
    background: #f0f0f0;
    border-radius: 8px;
  }
  #operation .operate{
    padding: 8px 2px;
    border-bottom: 1px solid #bbbbbb;
    font-size: 14px;
    user-select: none;
  }
  #operation .operate:last-child{
    border-bottom: none;
  }
  #operation .operate:hover{
    background: #54efef;
    font-weight: bold;
    color:var(--el-color-white);
  }
  #operation .operate:first-child:hover{
    background-color: #409eff;
    border-radius: 8px 8px 0px 0px;
  }
  #operation .operate:first-child+.operate:hover{
    background-color: #F56C6C;
  }
  #operation .operate:nth-child(3):hover{
    background-color: #e6a23c;
  }
  #operation .operate:last-child:hover{
    background-color: #67c23a;
    border-radius:0px 0px 8px 8px;
  }
  .showContext{
    display: block;
  }
  .hideContext{
    display: none;
  }
  .el-table .row-already-bought{
    background: #67C23A;
  }
  .el-table .row-invalid{
    background: #E6A23C;
  }
  .layout-page-inner>.hir-line {
    margin: 5px 0px;
  }
  [for="userGid"] + div {
    text-align:left;
    display: flex;
  }
  [for="userGid"] + div> div{
    margin-left: 5px;
  }
  .user-list-item{
    display:flex;
    margin:5px 0px;
    border-radius: 5px;
  }
  .user-list-item > div {
    line-height: 40px;
    margin-left: 5px;
  }
  .user-list-item:hover{
    color:var(--select-item-color);
    background-color: var(--select-background-color);
  }
</style>