const controller = require("../Controller/Admin")
const { Authentication } = require("../Middleware/Authenticate");


module.exports = [
    {
        method: 'POST',
        path: '/add-admin',
        handler: controller.createAdmin
    },
    {
        method: 'POST',
        path: '/admin-login',
        handler: controller.adminLogin
    },
    {
        method: 'GET',
        path: '/get-my-users',
        options: {
            pre: [Authentication],
            handler: controller.myUsersWithTask
        },
    },
    {
        method: 'PUT',
        path: '/update-project-status/{id}',
        options: {
            pre: [Authentication],
            handler: controller.updateProjectStatus
        },
    },
    {
        method: 'GET',
        path: '/admin-profile',
        options: {
            pre: [Authentication],
            handler: controller.adminProfile
        },
    },
]