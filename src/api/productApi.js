const  CATEGORY_API = {
    // 获取对应类目的商品列表
    getCategoryProductList:{
        method: 'get',
        url: '/product/category'
    },

    // 新增商品
    addProduct:{
        method: 'post',
        url: '/product/add'
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
}
export default CATEGORY_API