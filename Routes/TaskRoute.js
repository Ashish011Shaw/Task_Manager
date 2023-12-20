const controller = require("../Controller/TaskController")
const { Authentication } = require("../Middleware/Authenticate");

module.exports = [
    {
        method: 'POST',
        path: '/create-task',
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

]