const  SELLERINFO_API = {
    // 登录
    find:{
        method: 'post',
        url: '/info/find'
    },

    // 发送验证码
    updateSellerInfo:{
        method: 'post',
        url: '/info/update'
    },
}
export default SELLERINFO_API