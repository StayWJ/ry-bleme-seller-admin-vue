const  CATEGORY_API = {
    // 获取类目列表
    getCategoryList:{
        method: 'get',
        url: '/category/list'
    },

    // 新增类目
    addCategory:{
        method: 'post',
        url: '/category/add'
    },

    // 更新类目
    saveCategory:{
        method: 'post',
        url: '/category/save'
    },

    // 删除类目
    deleteCategory:{
        method: 'post',
        url: '/category/delete'
    },
}
export default CATEGORY_API