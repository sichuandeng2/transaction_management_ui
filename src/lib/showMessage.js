// import elementplus from 'element-plus'


const install = function (vue){
    vue.config.globalProperties.$showMessage = function (code, message, fun, duration = 3000){
        console.log(message)
        let statu = "";
        // let duration = 3000
        if (code == 200 || code == 1000) {
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
        // window.alert("show message info")
    }
}
export default install