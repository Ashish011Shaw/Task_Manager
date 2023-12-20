const prisma = require("../DB/DbConfig");

// create a task
const createATaskToUserByAdmin = async (req, h) => {
    try {
        const adminId = req.userId;
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }

        const { user_id, task_name, task_description } = req.payload;
        if (!user_id) {
            return h.response({ status: 404, message: "uesr_id is required" });
        }
        if (!task_name) {
            return h.response({ status: 404, message: "task_name is required" });
        }
        if (!task_description) {
            return h.response({ status: 404, message: "task_description is required" });
        }

        const newTask = await prisma.Task.create({
            data: {
                user_id: Number(user_id), task_name, task_description, admin_id: Number(adminId)
            }
        });

        return h.response({ status: 201, message: "Task created successfully", data: newTask })
    } catch (error) {
        console.log(error);
        return h.response({ message: "Error creating task" }).code(500);
    }
}

// delete a task 
const deleteTask = async (req, h) => {
    try {

        const adminId = req.userId;
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }

        const { id } = req.params;

        const task = await prisma.Task.delete({
            where: {
                id: Number(id)
            }
        });
        return h.response({ status: 200, message: "Task deleted successfully" })
    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error deleting task" })
    }
}

module.exports = {
    createATaskToUserByAdmin,
    deleteTask
}