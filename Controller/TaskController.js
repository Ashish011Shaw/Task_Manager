const prisma = require("../DB/DbConfig");

// create a task
const createATaskToUserByAdmin = async (req, h) => {
    try {
        const adminId = req.userId;
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }
        const { id } = req.params;
        const { task_name, task_description } = req.payload;
        if (!id) {
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
                user_id: Number(id), task_name, task_description, admin_id: Number(adminId)
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

// edit task
const editTask = async (req, h) => {
    try {
        const { id: task_id } = req.params;

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

        const updatedTask = await prisma.Task.update({
            where: {
                id: Number(task_id)
            },
            data: {
                user_id: Number(user_id), task_name, task_description, admin_id: Number(adminId)
            }
        });

        return h.response({ status: 201, message: "Task updated successfully", data: updatedTask })

    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error editing task" })
    }
}

// count
const projectCount = async (req, h) => {
    try {
        const adminId = req.userId;
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" }).code(404);
        }

        const counter = await prisma.Task.count({
            where: {
                admin_id: Number(adminId),
            }
        });
        return h.response({ success: true, data: counter });
    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error in counting task" }).code(500);
    }
};


// pending project count
const pendindProjectCounter = async (req, h) => {
    try {
        const adminId = req.userId;
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }
        const pendingCounter = await prisma.task.count({
            where: {
                AND: [
                    {
                        admin_id: Number(adminId),
                    },
                    {
                        status: "Pending"
                    }
                ]
            }
        });
        return h.response({ success: true, data: pendingCounter })
    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error in counting Pending task" }).code(500);
    }
}
module.exports = {
    createATaskToUserByAdmin,
    deleteTask,
    editTask,
    projectCount,
    pendindProjectCounter
}