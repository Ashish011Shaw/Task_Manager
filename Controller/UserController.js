const prisma = require("../DB/DbConfig");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET

// user sign-up
const createUser = async (req, h) => {
    try {
        const adminId = req.userId
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }


        const { name, username, email, password, mobile, isActive, user_type, } = req.payload;

        if (!name) {
            return h.response({ status: 404, message: "Name is required" });
        }
        if (!username) {
            return h.response({ status: 404, message: "username is required" });
        }
        if (!email) {
            return h.response({ status: 404, message: "Email is required" });
        }
        if (!password) {
            return h.response({ status: 404, message: "Password is required" });
        }
        if (!mobile) {
            return h.response({ status: 404, message: "Mobile is required" });
        }


        const preUser = await prisma.User.findFirst({
            where: {
                email
            }
        });

        if (preUser) {
            return h.response({ status: 400, message: "User already exists" })
        } else {
            // hash password 
            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.User.create({
                data: {
                    name, username, email, password: hashPassword, mobile, isActive, user_type,
                    admin_id: Number(adminId)
                }
            });

            return h.response({ status: 201, message: "User created successfully", data: newUser })
        }

    } catch (error) {
        console.log(error);
        return h.response({ message: "Error creating Admin" }).code(500);
    }
}

// update User
const updateUser = async (req, h) => {
    try {

        const adminId = req.userId
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }


        const { name, username, email, password, mobile, isActive, user_type, } = req.payload;

        if (!name) {
            return h.response({ status: 404, message: "Name is required" });
        }
        if (!username) {
            return h.response({ status: 404, message: "username is required" });
        }
        if (!email) {
            return h.response({ status: 404, message: "Email is required" });
        }
        if (!password) {
            return h.response({ status: 404, message: "Password is required" });
        }
        if (!mobile) {
            return h.response({ status: 404, message: "Mobile is required" });
        }

        const id = req.params.id;
        // hash password 
        const hashPassword = await bcrypt.hash(password, 10);

        const updatedUserData = await prisma.User.update({
            where: {
                id: Number(id)
            },
            data: {
                name, username, email, password: hashPassword, mobile, isActive, user_type,
                admin_id: Number(adminId)
            }
        });
        return h.response({ status: 200, message: "User updated successfully", data: updatedUserData })



    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error updating User" }).code(500);
    }
}

// delete user 
const deleteUserById = async (req, h) => {
    try {
        const adminId = req.userId
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }
        const userId = req.params.id;
        const user = await prisma.User.delete({
            where: {
                id: Number(userId)
            }
        });
        // if (!user) {
        //     return h.response({ status: 404, message: "User not found by this Id" });
        // } else {
        //     return h.response({ status: 200, msg: "User deleted successfully" });
        // }

        return h.response({ status: 200, msg: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error deleting User" }).code(500);
    }
}

// User-login 
const userLoginAfterApproval = async (req, h) => {
    try {
        const { email, password } = req.payload;

        if (!email) {
            return h.response({ status: 404, message: "Email is required" });
        }
        if (!password) {
            return h.response({ status: 404, message: "Password is required" });
        }

        // check user exists or not 
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            }
        });

        if (!existingUser) {
            return h.response({ status: 404, message: "User not found" });
        } else {

            if (existingUser.isActive == true) {
                const isMatch = await bcrypt.compare(password, existingUser.password);
                if (!isMatch) {
                    return h.response({ message: "Invalid password" });
                } else {
                    const token = jwt.sign({ email: existingUser.email }, SECRET, {
                        expiresIn: "1d"
                    });
                    return h.response({ status: 200, message: "Sucessfully sign-in", data: existingUser, token: token });
                }
            } else {
                return h.response({ status: 200, msg: "You are not approved for login till now.Please contact your administrator" })
            }

        }

    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error deleting User" });
    }
}

// user profile 
const userProfile = async (req, h) => {
    try {
        const userId = req.myUserId
        if (!userId) {
            return h.response({ status: 404, message: "You are not Approved user till now" });
        }

        const { id } = req.params;
        const userData = await prisma.User.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                mobile: true,
                isActive: true,
                user_type: true,
                admin_id: true,
            },
        });

        return h.response({ success: true, status: 200, data: userData });


    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error showing User's profile" });
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUserById,
    userLoginAfterApproval,
    userProfile
}
