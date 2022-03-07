import axios from 'axios'
// 指定默认地址
axios.default.baseURL = "http://localhost:5000/api";

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
        return response;
    },
    err => {
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

export default axios;