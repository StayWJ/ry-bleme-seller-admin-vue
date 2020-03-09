import axios from 'axios';
import orderApi from './orderApi';
import categoryApi from './categoryApi';
import productApi from './productApi';
import { Loading } from 'element-ui';
import { Message } from 'element-ui';

let instance = axios.create({
    baseURL: '/api',
})
const Http = {};

// api集合
let array = new Array();
array.push(orderApi);
array.push(categoryApi);
array.push(productApi);

array.forEach(element => {
    for (let key in element) {
        let api = element[key];
        Http[key] = async function (params, isFormData = false, config = {}) {

            let newParams = {}
            if (params && isFormData) {
                newParams = new FormData();
                for (let i in params) {
                    newParams.append(i, params[i])
                }
            } else {
                newParams = params
            }

            let response = {};
            if (api.method === 'put' || api.method === 'post' || api.method === 'patch') {
                try {
                    response = await instance[api.method](api.url, newParams, config)
                } catch (err) {
                    response = err;
                }
            } else if (api.method === 'delete' || api.method === 'get') {
                config.params = newParams;
                try {
                    response = await instance[api.method](api.url, config)
                } catch (err) {
                    response = err;
                }
            }

            return response;
        }
    }
});
    


// 拦截器
let loadingInstance = null;
instance.interceptors.request.use(config => {
    // 请求前处理
    loadingInstance = Loading.service({
        fullscreen: true
    });
    return config;
}, err => {
    //  请求错误
    loadingInstance.close();
    Message.error({
        message: '请求错误，请稍后重试'
    })
    return Promise.reject(err);
})
instance.interceptors.response.use(res => {
    loadingInstance.close();
    return res.data;
}, err => {
    loadingInstance.close();
    let message = '网络异常，一般是我没开后台';
    if(typeof(err.response.data.message) != "undefined"){
        message = err.response.data.message;
    }
    Message.error({
        message: message
    })
    return Promise.reject(err);
})

export default Http