<template>
    <Layout>
        <template v-slot:inner>
            <div>
                <h1>个人信息</h1>
                <div class="info">
                    <el-avatar :size="40" :src="userInfomation.userAvatarUrl">{{userInfomation.userAvatarUrl==''?"添加":""}}</el-avatar>
                    <div class="none-select">{{userInfomation.nickName}}</div>
                    <p>账号：{{userInfomation.userName}}</p>
                    <p>用户名：{{userInfomation.nickName}}</p>
                    <p>角色:{{userInfomation.roles == null ? '未知' : userInfomation.roles}}</p>
                    <p>性别：{{userInfomation.userGender == 1 ? '男' : '女'}}</p>
                    <p>电话：{{userInfomation.phone == null ? '未知': userInfomation.phone}}</p>
                    <p>邮箱：{{userInfomation.email == null ? '未知' : userInfomation.email}}</p>
                    <p>QQ:{{userInfomation.qq == null ? '未知': userInfomation.qq}}</p>
                    <p>微信：{{userInfomation.wechat == null ? '未知' : userInfomation.wechat}}</p>
                </div>
                <el-button type="primary">编辑</el-button>
            </div>
        </template>
    </Layout>

</template>

<script>
import Layout from "../../components/Layout.vue";
export default {
    name:"personal",
    components:{
        Layout
    },
    data(){
        return{
            name: 'developer',
            userInfomation: {
                avater: "",
                userName: '',
                phone: '',
                email: '',
            }
        }
    },
    mounted(){
        this.userInfomation = JSON.parse(sessionStorage["userInfomation"])
        console.log(this.userInfomation)
    }
    
}
</script>

<style>
    .info{
        margin-left: 28px;
        text-align: left;
    }
</style>