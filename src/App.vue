<template>
  <router-view/>
</template>
<script>

export default {
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
