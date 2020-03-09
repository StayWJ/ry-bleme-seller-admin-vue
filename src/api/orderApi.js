const  ORDER_API = {
    // 获取订单列表
    getOrderList:{
        method: 'get',
        url: '/order/list'
    },

    // 接取订单
    accept:{
        method: 'post',
        url: '/order/accept'
    },

    // 派送订单
    delivery:{
        method: 'post',
        url: '/order/delivery'
    },

    // 取消订单
    cancel:{
        method: 'post',
        url: '/order/cancel'
    },

    // 完结订单
    finish:{
        method: 'post',
        url: '/order/finish'
    },
}
export default ORDER_API