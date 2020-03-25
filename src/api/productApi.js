const  PRODUCT_API = {
    // 获取对应类目的商品列表
    getCategoryProductList:{
        method: 'get',
        url: '/product/category'
    },

    // 更新商品
    saveProduct:{
        method: 'post',
        url: '/product/save'
    },

    // 删除商品
    deleteProduct:{
        method: 'post',
        url: '/product/delete'
    },

    // 删除图片
    delTemp: {
        method: 'post',
        url: '/product/del'
    },
}
export default PRODUCT_API