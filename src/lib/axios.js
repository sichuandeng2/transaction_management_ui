import axios from 'axios'
import { stringifyQuery } from 'vue-router';
const baseURL = "http://localhost:5000/api"
// 指定默认地址
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 10000;
// axios.defaults.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 指定请求拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage["token"]) {
            config.headers.authorization = "bearer " + localStorage["token"]
        }
        return config;
    },
    err => {
        return Promise.reject("err");
    }
);

// 指定响应拦截器
axios.interceptors.response.use(
    response =>{
        if (response.status == 200) {
           
            return response.data;
        }
        console.log(response);
        return response;
    },
    err => {
        console.log(err)
        let regExp = RegExp(/Network Error/)
        // console.log(err.match(regExp));
        // console.log(err.search("Error"));
        let status = err.response.status;
        switch(status){
            case 401:
                localStorage.clear("token")
                window.location.href = "/login"
                break;   
            case 500:
                window.alert("系统内部错误");
                break;
        }
    }
) 
const requestGet = function (url, config){
    return axios.get(url, config)
}
const requestPost = function (url,data,config){
   return axios.post(url,data,config)
}
const requestPut = function (url, data, config){
    return axios.put(url, data, config);
}
const requestDelete = function(url,config){
    return axios.delete(url, config);
}
let http = {
    baseURL,
    get: requestGet,
    post: requestPost,
    put: requestPut,
    delete: requestDelete,
}
const install= function(vue){
    vue.config.globalProperties.$http = http;
}
export default install;