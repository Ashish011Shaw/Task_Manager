const controller = require("../Controller/UserController")
const { Authentication } = require("../Middleware/Authenticate");
const userAuth = require("../Middleware/UserAuth");



module.exports = [

    {
        method: 'POST',
        path: '/add-user',
        options: {
            pre: [Authentication],
            handler: controller.createUser
        },
    },
    {
        method: 'PUT',
        path: '/update-user/{id}',
        options: {
            pre: [Authentication],
            handler: controller.updateUser
        },
    },
    {
        method: 'DELETE',
        path: '/delete-user/{id}',
        options: {
            pre: [Authentication],
            handler: controller.deleteUserById
        },
    },
    {
        method: 'POST',
        path: '/user-login',
        handler: controller.userLoginAfterApproval
    },
    {
        method: 'GET',
        path: '/my-profile/{id}',
        options: {
            pre: [userAuth],
            handler: controller.userProfile
        },
    },


]