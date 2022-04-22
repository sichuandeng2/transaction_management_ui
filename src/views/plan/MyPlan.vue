<template>
    <Layout>
    <template v-slot:inner>
      <div style="display: flex; justify-content: space-between">
        <el-form label-width="80px" style="display: flex">
          <el-form-item label="计划名称">
            <el-input
              v-model="search.planName"
              v-on:input="research"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-divider class="hir-line"></el-divider>

      <el-table :data="tableData" highlight-current-row max-height="calc( 100vh - 225px)" style="overflow-y: scroll;">
        <el-table-column prop="kid" label="序号" width="50">
          <template #default="scope">
            {{ ++scope.$index }}
          </template>
        </el-table-column>
        <el-table-column prop="planName" label="计划名称" width="120" show-overflow-tooltip />
        <el-table-column prop="progress" label="进度" width="80" show-overflow-tooltip />
        <el-table-column prop="planInner" label="计划内容" width="120" show-overflow-tooltip />
        <el-table-column prop="expireDate" label="到期时间" width="220" show-overflow-tooltip />
				<el-table-column prop="cycleTime" label="周期" width="80" show-overflow-tooltip >
					<template #default="scope">
						{{getCycleText(scope.row.cycleType)}}
					</template>
				</el-table-column>
				<el-table-column prop="planType" label="计划类型" width="120">
					<template #default="scope">
						{{getPlanTypeName(scope.row.planType)}}
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" @click="lookDetail(scope.row)">详情</el-button>
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
      <!-- 弹出层 -->
      <el-dialog title="详情" v-model="isShowTask" width="680px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          					<el-form-item label="计划名称" prop="planName">
						<el-input v-model="form.planName" placeholder="请输入计划名称"></el-input>
					</el-form-item>
					<el-form-item label="计划内容" prop="planName">
						<el-input v-model="form.planInner" placeholder="请输入计划内容"></el-input>
					</el-form-item>
					<div style="display:flex">
						<el-form-item label="计划周期" style="text-align: left;">
							<el-select v-model="form.cycleType" placeholder="请选择" filterable
								>
								<el-option label="单次" value="0"></el-option>
								<el-option label="每小时" value="1"></el-option>
								<el-option label="每天" value="2"></el-option>
								<el-option label="每周" value="3"></el-option>
								<el-option label="每月" value="4"></el-option>
								<el-option label="每季度" value="5"></el-option>
								<el-option label="每年" value="6"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="时间" prop="selectedTime">
              <el-input v-model="form.expireDate" placeholder="请输入计划内容"></el-input>
						</el-form-item>
					</div>
					<el-form-item label="计划类型" style="text-align: left;">
						<el-radio-group v-model="form.planType">
							<el-radio label="1">学习计划</el-radio>
							<el-radio label="2">工作计划</el-radio>
							<el-radio label="3">生活计划</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="form.remark" type="textarea" rows="5"></el-input>
					</el-form-item>
          <el-button @click="isShowTask = false">关闭</el-button>
        </el-form>
      </el-dialog>
    </template>
  </Layout>
</template>

<script>
import Layout from "../../components/Layout.vue";
import { ElLoading } from "element-plus";
export default {
    name: "MyPlan",
    components:{
        Layout,
    },
      data() {
    return {
      tableData: [],
      form: {
        planName: "",
        planInner: "",
        expireDate: "",
        cycleType: 0,
        planType: 0,
        progress: 0,
        remark: ""
      },
      rules: {
        materialName: [
          { required: true, message: "材料名称不能为空", trigger: "blur" },
          { max: 255, message: "长度不能超过 255 个字符", trigger: "blur" },
        ],
        quantityRequired: [
          { required: true, message: "购置数量不能为空", trigger: "blur" },
          { type: "number", message: "请输入整数", trigger: "blur" },
        ],
      },
      search: {
        planName: "",
        pageSize: 10,
        pageIndex: 1
      },
      count:0,
      isShowTask: false
    };
  },
  methods: {
    // 获取当前任务集合
    getPlanLogHistoryByPage() {
      const loading = ElLoading.service({
        fullscreen: false,
        text: "服务连接中......",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$http
        .get(
          `/Plan/getPlanLogHistoryByPage`,
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
    // 重新搜索数据列表集合
    research() {
      if (this.searchMark) {
        window.clearTimeout(this.searchMark);
        this.searchMark = null;
      }
      this.searchMark = window.setTimeout(() => {
        this.getPlanLogHistoryByPage();
      }, 1000);
    },
    selectBlur() {},
    getCurrentPageIndex(item) {
      this.search.pageIndex = item;
      this.getPlanLogHistoryByPage();
    },
    handleChange(item) {
      this.search.pageSize = item;
      this.getPlanLogHistoryByPage();
    },
    lookDetail(row){
      this.form.planName =row.planName
      this.form.planInner=row.planInner
      this.form.expireDate=row.expireDate
      this.form.cycleType=row.cycleType+""
      this.form.planType=row.planType+""
      this.form.progress=row.progress
      this.form.remark=row.remark
      this.isShowTask = true;
    },
    // 获取计划类型名称
    getPlanTypeName(planTypeIndex) {
      switch (planTypeIndex) {
        case 1:
          return "学习计划";
        case 2:
          return "工作计划";
        case 3:
          return "生活计划"
        default:
          return "未知"
      }
    },
    // 获取周期信息
    getCycleText(cycleIndex) {
      switch (cycleIndex) {
        case 0:
          return "单次"
        case 1:
          return "每小时"
        case 2:
          return "每天"
        case 3:
          return "每周"
        case 4:
          return "每月"
        case 5:
          return "每季度"
        case 6:
          return "每年"
        default:
          return "未知"
      }
    },
    // 获取周期时间信息
    getCycleTime(timer, type) {
      let time = new Date(timer)
      switch (type) {
        case 0:
          return time.format("yyyy-MM-dd hh:mm");
        case 1:
          return time.format("mm") + "分";
        case 2:
          return time.format("hh:mm");
        case 3:

          switch (time.getDay()) {
            case 0:
              return "周日" + time.format(" hh:mm")
            case 1:
              return "周一" + time.format(" hh:mm")
            case 2:
              return "周二" + time.format(" hh:mm")
            case 3:
              return "周三" + time.format(" hh:mm")
            case 4:
              return "周四" + time.format(" hh:mm")
            case 5:
              return "周五" + time.format(" hh:mm")
            case 6:
              return "周六" + time.format(" hh:mm")
          }
          return "未知"
        case 4:
          return time.format("dd日hh:mm")
        case 5:
          return "第" + (((time.getMonth() +1) % 3 == 0 ) ? (time.getMonth() + 1)/3 : Math.floor((time.getMonth() + 1) / 3 + 1)) + "季度" + time.format("MM-dd hh:mm")
        case 6:
          return time.format("MM-dd hh:mm")
      }
    },
  },
  mounted() {
    this.getPlanLogHistoryByPage();
  },

}
</script>

<style>

</style>