let permissionList = [
    {
        expand: false,
        title: '页面',
        ispage: true,
        children: [
            {
                title: '权限管理',
                expand: false,
                id: 6000,
                children: [
                    {
                        title: '角色管理',
                        expand: false,
                        id: 6100,
                    },
                    {
                        title: '职员管理',
                        expand: false,
                        id: 6200
                    },
                ]
            },
            {
                title: '用户管理',
                expand: false,
                id: 14000,
                children: [
                    {
                        title: '用户列表',
                        expand: false,
                        id: 14100,
                    }
                ]
            },
            {
                title: '商品管理',
                expand: false,
                id: 7000,
                children: [
                    {
                        title: '商品列表',
                        expand: false,
                        id: 7100,
                    },
                    {
                        title: '分类管理',
                        expand: false,
                        id: 7200
                    },
                ]
            },
            {
                title: '优惠券列表',
                expand: false,
                id: 8000,
                children: [
                    {
                        title: '优惠券列表',
                        expand: false,
                        id: 8100,
                    },
                ]
            },
            {
                title: '订单列表',
                expand: false,
                id: 9000,
                children: [
                    {
                        title: '订单列表',
                        expand: false,
                        id: 9100,
                    },
                    {
                        title: '每日商品配送',
                        expand: false,
                        id: 9200,
                    },
                    {
                        title: '商品配送列表',
                        expand: false,
                        id: 9300,
                    },
                ]
            },
            {
                title: '门店列表',
                expand: false,
                id: 10000,
                children: [
                    {
                        title: '门店列表',
                        expand: false,
                        id: 10100,
                    },
                ]
            },
            {
                title: '首页配置',
                expand: false,
                id: 11000,
                children: [
                    {
                        title: '首页配置',
                        expand: false,
                        id: 11100,
                    },
                ]
            },
            {
                title: '比例管理',
                expand: false,
                id: 12000,
                children: [
                    {
                        title: '金币汇率',
                        expand: false,
                        id: 12100,
                    },
                    {
                        title: '返佣比例',
                        expand: false,
                        id: 12200,
                    },
                    {
                        title: '赠送金币',
                        expand: false,
                        id: 12300,
                    },
                    {
                        title: '金币上限',
                        expand: false,
                        id: 12400,
                    },
                ]
            },
            {
                title: '工具管理',
                expand: false,
                id: 13000,
                children: [
                    {
                        title: '图片上传',
                        expand: false,
                        id: 13100,
                    }
                ]
            }
        ]
    },
    {
        expand: false,
        title: '接口',
        children: [
            {
                title: '权限模块',
                expand: false,
                // id: 6000,
                children: [
                    {
                        title: '角色',
                        expand: false,
                        // id:6100,
                        children: [
                            {title: '获取角色列表', id: 6101, path: '/admin/permission/roleList'},
                            {title: '添加角色', id: 6102, path: '/admin/permission/addRole'},
                            {title: '编辑角色', id: 6103, path: '/admin/permission/editRole'},
                            {title: '删除角色', id: 6104, path: '/admin/permission/delRole'},
                        ]
                    },
                    {
                        title: '职员',
                        expand: false,
                        // id:6200
                        children: [
                            {title: '获取职员列表', id: 6201, path: '/admin/permission/staffList'},
                            {title: '添加职员', id: 6202, path: '/admin/permission/addStaff'},
                            {title: '编辑职员', id: 6203, path: '/admin/permission/editStaff'},
                            {title: '删除职员', id: 6204, path: '/admin/permission/delStaff'},
                        ]
                    },
                    {title: '获取权限列表', id: 6001, path: '/admin/permission/list'},
                ]
            },
        ]
    }
];

let allPermissionList = [];

addAccess(permissionList[0]);
addAccess(permissionList[1]);

function addAccess(value) {
    if (value.children) {
        if(value.id) {
            allPermissionList.push(value.id);
        }
        value.children.forEach((value, index) => {
            addAccess(value);
        });
    } else {
        allPermissionList.push(value.id);
    }
}

module.exports = {
    permissionList,
    allPermissionList,  // 页面参数
};

