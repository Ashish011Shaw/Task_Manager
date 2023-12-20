const prisma = require("../DB/DbConfig");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET

// create admin 
const createAdmin = async (req, h) => {
    try {
        const { admin_name, email, password } = req.payload;
        if (!admin_name) {
            return h.response({ status: 404, message: "admin_name is required" });
        }
        if (!email) {
            return h.response({ status: 404, message: "email is required" });
        }
        if (!password) {
            return h.response({ status: 404, message: "passsword is required" });
        }

        const preAdmin = await prisma.Admin.findFirst({
            where: {
                email
            }
        });
        if (preAdmin) {
            return h.response({ status: 400, message: "admin_name already exists" });
        } else {
            // hash password 
            const hashedPassword = await bcrypt.hash(password, 10);

            const adminData = await prisma.Admin.create({
                data: {
                    admin_name,
                    email,
                    password: hashedPassword
                }
            });

            return h.response({ status: 201, msg: "Admin created successfully!", data: adminData })
        }
    } catch (error) {
        console.log(error);
        return h.response({ message: "Error creating Admin" }).code(500);
    }
}

// login 
const adminLogin = async (req, h) => {
    try {
        const { email, password } = req.payload;
        if (!email) {
            return h.response({ message: "Please enter your email" });
        }
        if (!password) {
            return h.response({ message: "Please enter your password" });
        }

        const admin = await prisma.Admin.findFirst({
            where: {
                email
            }
        });


        if (!admin) {
            return h.response({ status: 404, message: "Admin not found" });
        } else {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return h.response({ message: "Invalid password" });
            } else {
                const token = jwt.sign({ email: admin.email }, SECRET, {
                    expiresIn: "1d"
                })
                return h.response({ status: 200, message: "Sucessfully sign-in", data: admin, token: token });
            }
        }


    } catch (error) {
        console.log(error);
        return h.response({ message: "Error while login Admin" }).code(500);
    }
}

// my-users with their task 
const myUsersWithTask = async (req, h) => {
    try {
        const adminId = req.userId;
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }

        const users = await prisma.user.findMany({
            where: {
                admin_id: Number(adminId)
            },
            include: {
                Task: true
            }
        });
        return h.response({ status: 200, data: users })
    } catch (error) {
        console.log(error);
        return h.response({ message: "Error while login Admin", error }).code(500);
    }
}

// right to change project's status of my user
const updateProjectStatus = async (req, h) => {
    try {
        const adminId = req.userId;
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }

        const { id } = req.params;
        const { status } = req.payload;

        const updateStatus = await prisma.Task.update({
            where: {
                id: Number(id),
            },
            data: {
                status: status
            }
        });
        return h.response({ status: 200, msg: "Task's status updated successfully", data: updateStatus })
    } catch (error) {
        console.log(error);
        return h.response({ message: "Error while login Admin", error }).code(500);
    }
}
module.exports = {
    createAdmin,
    adminLogin,
    myUsersWithTask,
    updateProjectStatus
}