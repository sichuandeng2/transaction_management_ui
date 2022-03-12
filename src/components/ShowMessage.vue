<template>
  
</template>

<script>
export default {
    name: 'showMessage',
    methods:{
        showMessage(code, message, fun){
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
        }
    },
    mounted(){
        console.log("tests");
    }
}
</script>

<style>

</style>