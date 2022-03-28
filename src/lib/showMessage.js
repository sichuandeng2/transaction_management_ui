// import elementplus from 'element-plus'


const install = function (vue){
    vue.config.globalProperties.$showMessage = function (code, message, fun, duration = 1200){
        let statu = "";
        if (code == 200 || code == 1000) {
            statu = "success";
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
}
export default install