const controller = require("../Controller/TaskController")
const { Authentication } = require("../Middleware/Authenticate");

module.exports = [
    {
        method: 'POST',
        path: '/create-task/{id}',
        options: {
            pre: [Authentication],
            handler: controller.createATaskToUserByAdmin
        },
    },
    {
        method: 'DELETE',
        path: '/delete-task/{id}',
        options: {
            pre: [Authentication],
            handler: controller.deleteTask
        },
    },
    {
        method: 'PUT',
        path: '/edit-task/{id}',
        options: {
            pre: [Authentication],
            handler: controller.editTask
        },
    },
    {
        method: 'GET',
        path: '/count-projects',
        options: {
            pre: [Authentication],
            handler: controller.projectCount
        },
    },
    {
        method: 'GET',
        path: '/count-pending-projects',
        options: {
            pre: [Authentication],
            handler: controller.pendindProjectCounter
        },
    },
]