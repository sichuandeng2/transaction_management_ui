<template>
	<Layout>
		<template v-slot:inner>
			<!-- 查询条件 -->
			<div style="display: flex; justify-content: space-between">
			  <el-form label-width="80px" style="display: flex">
			    <el-form-item label="计划名称">
			      <el-input
			        v-model="search.planName"
			        v-on:input="research"
			      ></el-input>
			    </el-form-item>
			    <el-form-item label="计划类型">
			      <el-select
			        v-model="search.planType"
			        placeholder="请选择"
			        v-on:change="research"
			        filterable
			        v-on:blur="selectBlur"
			      >
			        <el-option label="全部" value="0"></el-option>
			        <el-option label="学习计划" value="1"></el-option>
			        <el-option label="工作计划" value="2"></el-option>
			        <el-option label="生活计划" value="3"></el-option>
			      </el-select>
			    </el-form-item>
				<el-form-item label="周期">
				  <el-select
				    v-model="search.cycleType"
				    placeholder="请选择"
				    v-on:change="research"
				    filterable
				    v-on:blur="selectBlur"
				  >
				    <el-option label="全部" value="-1"></el-option>
					<el-option label="单次" value="0"></el-option>
					<el-option label="每小时" value="1"></el-option>
					<el-option label="每天" value="2"></el-option>
					<el-option label="每周" value="3"></el-option>
					<el-option label="每月" value="4"></el-option>
					<el-option label="每季度" value="5"></el-option>
					<el-option label="每年" value="6"></el-option>
				  </el-select>
				</el-form-item>
			  </el-form>
			  <el-button type="primary" @click="insertPlan" style="height: 16px">新增计划</el-button>
			</div>
			<!-- 表格 -->
			<el-table :data="tableData" highlight-current-row>
				<el-table-column prop="gid" label="序号" width="50">
					<template #default="scope">
						{{ ++scope.$index }}
					</template>
				</el-table-column>
				<el-table-column prop="planName" label="计划名称" width="220" />
				<el-table-column prop="planType" label="计划类型" width="120">
					<template #default="scope">
						{{getPlanTypeName(scope.row.planType)}}
					</template>
				</el-table-column>
				<el-table-column prop="cycleTime" label="时间" width="220">
					<template #default="scope">
						{{getCycleTime(scope.row.timeZone, scope.row.cycleType)}}
					</template>
				</el-table-column>
				<el-table-column prop="cycleTime" label="周期" width="80">
					<template #default="scope">
						{{getCycleText(scope.row.cycleType)}}
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" />
				<el-table-column label="操作">
					<template #default="scope">
						<el-button type="text" @click="editPlan(scope.row)">编辑</el-button>
						<el-button type="text" @click="deletePlan(scope.row.kid, scope.row.planName)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页器 -->
			<div style="text-align: right; padding-right: 23px; padding-top: 20px">
				<el-pagination background layout="sizes, prev, pager, next" @current-change="getCurrentPageIndex"
					@size-change="handleChange" :page-size="search.pageSize" :page-sizes="[10, 20, 50, 999]"
					:total="count"></el-pagination>
			</div>
			<!-- 编辑弹出层 -->
			<el-dialog :title="isEdit?'编辑':'新增'" v-model="isShowEdteOrInsert" width="680px">
				<el-form ref="form" :model="formData" :rules="rules" label-width="80px">
					<el-form-item label="计划名称" prop="planName">
						<el-input v-model="formData.planName" placeholder="请输入计划名称"></el-input>
					</el-form-item>
					<div style="display:flex">
						<el-form-item label="计划周期" style="text-align: left;">
							<el-select v-model="formData.cycleType" placeholder="请选择" filterable
								v-on:change="changeCycleType">
								<el-option label="单次" value="0"></el-option>
								<el-option label="每小时" value="1"></el-option>
								<el-option label="每天" value="2"></el-option>
								<el-option label="每周" value="3"></el-option>
								<el-option label="每月" value="4"></el-option>
								<el-option label="每季度" value="5"></el-option>
								<el-option label="每年" value="6"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="时间" >
							<div class="block">
								<el-date-picker v-model="selectedTime" type="datetime" placeholder="选择到期的时间"
									format="MM-DD HH:mm dddd" />
							</div>
						</el-form-item>
					</div>
					<el-form-item label="计划类型" style="text-align: left;">
						<el-radio-group v-model="formData.planType">
							<el-radio label="1">学习计划</el-radio>
							<el-radio label="2">工作计划</el-radio>
							<el-radio label="3">生活计划</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="formData.remark" type="textarea" rows="5"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit('form')">提交</el-button>
						<el-button @click="isShowEdteOrInsert = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</template>
	</Layout>
</template>

<script>
	import Layout from '../components/Layout.vue'
	import {
		ElMessageBox
	} from "element-plus";
	export default {
		name: 'plan',
		components: {
			Layout,
			ElMessageBox
		},
		data() {
			return {
				search: {
					planName: '',
					cycleType: '-1',
					planType: "0",
					pageIndex: 1,
					pageSize: 10
				},
				tableData: [],
				count: 0,
				isShowEdteOrInsert: false,
				formData: {
					kid: null,
					planName: '',
					planType: '1',
					cycleType: '0',
					timeZone: 0,
					remark: ''
				},
				rules: {
					planName: [
						{
							required: true,
							message: "计划名称不能为空",
							trigger: "blur"
						},
						{
							max: 30,
							message: "长度不能超过 30 个字符",
							trigger: "blur"
						},
					],
					// timeZone: [
					// 	{
					// 		required: true,
					// 		message: "计划的指定时间不能为空",
					// 		trigger: "blur"
					// 	},
					// ]
				},
				selectedTime: '',
				isEdit: false,
				searchMark: null
			}
		},
		methods: {
			// 获取计划任务集合
			getPlanListByPage() {
				this.$http
					.get(
						`/plan/getPlanListByPage`, {
							params: {
								...this.search
							}
						}
					)
					.then(({
						data,
						code,
						message,
						count
					}) => {
						if (code == 200) {
							this.tableData = data;
							this.count = count;
						}
						// this.$showMessage(code, message);
					});
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
			// 获取当前页码
			getCurrentPageIndex(item) {
				this.search.pageIndex = item;
				this.getPlanListByPage();
			},
			// 修改页数大小
			handleChange(item) {
				this.search.pageSize = item;
				this.getPlanListByPage();
			},
			// 编辑计划任务
			editPlan(row) {
				this.isEdit = true;
				this.formData.planType = row.planType + ''
				this.formData.cycleType = row.cycleType + ''
				this.formData.planName = row.planName
				this.formData.kid = row.kid
				this.formData.remark = row.remark
				this.selectedTime = new Date(row.timeZone)
				console.log(row.timeZone)
				this.timeZone = row.timeZone
				//this.changeTimmer(row.planType)
				this.isShowEdteOrInsert = true
			},
			// 删除任务
			deletePlan(guid, planName) {
				
				ElMessageBox
				.confirm(`您确定要删除计划为${planName}的数据吗？`,"系统提示",
				  {
				    confirmButtonText: "确认", 
				    cancelButtonText:"取消",
				    type: "warning"
				  }
				)
				.then(()=> {
					this.$http.delete(`/Plan/DeletePlan`, {
								params: {
									gid: guid
								}
							})
							.then(({
								code,
								message
							}) => {
								this.$showMessage(code, message, () => {
									if (code == 200) this.getPlanListByPage();
								});
							})
					
				})
				.catch((action)=>{
				  if(action == "cancel") return;
				})
			},
			// 提交表单
			onSubmit(formName) {
				this.formData.timeZone = this.selectedTime.getTime()
				console.log(this.selectedTime)
				this.$refs[formName].validate(valid =>{
					if(valid){
						if(this.isEdit){
							this.$http.put('/Plan/UpdatePlan', {...this.formData})
							.then(({code, message}) => {
								this.$showMessage(code, message, () => {
									if(code == 200) {
										this.getPlanListByPage()
										this.isShowEdteOrInsert = false
									}
								})
							})
						}
						else{
							console.log("tset")
							this.$http.post('/Plan/InsertPlan', {...this.formData})
							.then(({code, message})=>{
								this.$showMessage(code, message, () => {
									if(code == 200) {
										this.getPlanListByPage()
										this.isShowEdteOrInsert = false
									}
								})
							})
						}

					}
					else{
						console.log("验证失败")
					}
				})
			},
			changeCycleType(item) {
				// this.changeTimmer(item)
				this.selectedTime = ''
			},
			changeTimmer(index) {
				switch (index) {
					// 单次
					case 0:
						this.setFormat = "YYYY-MM-DD hh:mm"
						break;
						// 小时
					case 1:
						this.setFormat = "mm"
						break;
						// 天
					case 2:
						this.setFormat = "hh:mm"
						break;
						// 周
					case 3:
						this.setFormat = "dddd hh:mm"
						this.datetimeType = 'datetime'
						break;
						// 月
					case 4:
						this.setFormat = "DD hh:mm"
						break;
						// 季度
					case 5:
						this.format = "MM-DD hh:mm"
						break;
						// 年
					case 6:
						this.setFormat = "MM-DD hh:mm"
						break;
					default:
						break;
				}
			},
			// 重新搜索数据列表集合
			research() {
			  if (this.searchMark) {
			    window.clearTimeout(this.searchMark);
			    this.searchMark = null;
			  }
			  this.searchMark = window.setTimeout(() => {
			    this.getPlanListByPage();
			  }, 1000);
			},
			selectBlur() {},
			// 新增计划
			insertPlan(){
				this.formData.kid = null;
				this.isEdit = false;
				this.selectedTime = '';
				this.isShowEdteOrInsert = true;
				
			}
		},
		mounted() {
			this.getPlanListByPage();
		}
	}
</script>

<style>

</style>
