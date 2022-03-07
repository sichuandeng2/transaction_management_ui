<template>
    <el-dialog title="选择委托人" v-model="isShowSelectClient" width = "300px">
        <el-input v-model="searchClient" placeholder="请输入搜索对象" v-on:input="searchChange">
            <template #prefix>
            <el-icon size="25"><search style="width: 20px; height: 20px;margin-left:5px;margin-top:10px;" /></el-icon>
            </template>
        </el-input>
        <div class="select-client-module">
            <template v-for="item in userInformationList" :key="item.gid">
                <div class="user-list-item cursor-pointer" @click="clickUserListItem(item)">
                    <el-avatar :size="40" :src="item.userAvatarUrl"></el-avatar>
                    <div class="none-select">{{item.nickName}}</div>
                </div>
            </template>
        </div>
    </el-dialog>
</template>

<script>
import {Search} from "@element-plus/icons";
    export default {
        name:"SelectClient",
        components:{
            Search
        },
        props:{
            isShowSelectClient: Boolean
        },
        data(){
            return {
                userInformationList:[],
                searchClient:'',
                isShow: false,
                searchMark: null
            }
        },
        methods:{
            searchChange(){
                console.log(this.searchClient)
                if (this.searchMark) {
                    window.clearTimeout(this.searchMark);
                    this.searchMark = null;
                }
                this.searchMark = window.setTimeout(()=> {
                    this.getSelectClientList();
                }, 1000)
            },
            getSelectClientList(){
                this.axios
                .get(
                    `${this.axios.default.baseURL}/Account/GetUserInfomationByList`,
                    {params: {nickName:this.searchClient}}
                )
                .then(({ data, code, message }) => {
                    if (code == 200) {
                        this.userInformationList = data;
                    }else{
                        this.showMessage(code, message, () => {
                        });
                    }
                });
            },
            showMessage(code, message, fun, duration = 1500) {
                let statu = "";
                if (code == 200) {
                    statu = "success";
                    duration = 500;
                } else {
                    statu = "error";
                }
                this.$message({
                    message: message,
                    type: statu,
                    duration: duration,
                    onClose: fun,
                });
            },
            clickUserListItem(item){
                this.$parent.$parent.form.userInfo = item;
                this.$parent.$parent.form.UserGid = item.gid;
                this.$parent.$parent.isSelectClient = false;
                this.searchClient=""
                this.getSelectClientList()
            }
        },
        mounted(){
            this.getSelectClientList();
        },

    }
</script>

<style lang="scss" scoped>
    .select-client-module{
        max-height: calc( 100vh - 50vh );
        margin-top: 5px;
        overflow: auto;
    }
</style>