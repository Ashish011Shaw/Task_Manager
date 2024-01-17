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
    {
        method: 'PUT',
        path: '/update-admin/{id}',
        options: {
            pre: [Authentication],
            handler: controller.updateAdmin
        },
    },
    {
        method: 'POST',
        path: '/admin/password-reset',
        options: {
            pre: [Authentication],
            handler: controller.adminPasswordReset
        },
    },
    {
        method: 'GET',
        path: '/count-my-users',
        options: {
            pre: [Authentication],
            handler: controller.myTotalUsers
        },
    },
]