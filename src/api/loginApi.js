const  LOGIN_API = {
    // 登录
    login:{
        method: 'post',
        url: '/login/login'
    },

    // 发送验证码
    sendCode:{
        method: 'get',
        url: '/login/code'
    },
}
export default LOGIN_API