<template>
  <router-view/>
</template>
<script>

export default {
  methods:{
    bingDateFormat(){
      Date.prototype.format = function(format){
        let matString = {
          "yyyy": this.getFullYear(),
          "MM": this.getMonth() + 1,
          "dd": this.getDate(),
          "hh": this.getHours(),
          "mm": this.getMinutes(),
          "ss": this.getSeconds()
        }
        if(/yyyy/.test(format))format = format.replace(/yyyy/,matString.yyyy)
        for (const key in matString) {
          if(key == 'yyyy') continue;
          if(new RegExp("("+ key +")").test(format)){
            format = format.replace(RegExp.$1, matString[key] > 9 ? matString[key]: "0" + matString[key])
          }
        }
        return format;
      }
    }
  },
  mounted(){
    this.bingDateFormat();
  }
}
</script>
<style>
*{
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
 }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.none-select{
  user-select:none;
}
.cursor-pointer{
  cursor: pointer;
}
:root{
  --select-item-color: #409eff;
  --select-background-color: #b3d8ff;
}
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    border-radius: 10px;
    background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44,rgb(60,186,146)),color-stop(0.72,rgb(253,187,45)),color-stop(0.86,rgb(253,187,45)));
    transition: 0.3s ease-in-out;
}
::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
}
</style>
<style scoped>
  div > table {
  height: calc(100vh - 214px );
  overflow-y: scroll;
}
</style>
