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
</style>
