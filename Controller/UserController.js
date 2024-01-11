const prisma = require("../DB/DbConfig");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET

// user sign-up
const createUser = async (req, h) => {
    try {
        const adminId = req.userId
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" }).code(404);
        }

        const { name, username, email, password, mobile, isActive, user_type, gender } = req.payload;


        if (!name) {
            return h.response({ status: 404, message: "Name is required" }).code(404)
        }
        if (!username) {
            return h.response({ status: 404, message: "username is required" }).code(404);
        }
        if (!email) {
            return h.response({ status: 404, message: "Email is required" }).code(404);
        }
        if (!password) {
            return h.response({ status: 404, message: "Password is required" }).code(404);
        }
        if (!mobile) {
            return h.response({ status: 404, message: "Mobile is required" }).code(404);
        }
        if (!gender) {
            return h.response({ status: 404, message: "Gender is required" }).code(404);
        }


        const preUser = await prisma.User.findFirst({
            where: {
                email
            }
        });

        if (preUser) {
            return h.response({ status: 400, message: "User already exists" }).code(400)
        } else {
            // hash password 
            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.User.create({
                data: {
                    name, username, email, password: hashPassword, mobile, isActive, user_type, gender,
                    admin_id: Number(adminId)
                }
            });

            return h.response({ status: 201, message: "User created successfully", data: newUser }).code(201)
        }

    } catch (error) {
        console.log(error);
        return h.response({ message: "Error creating Admin", Error: error }).code(500);
    }
}

// update User
const updateUser = async (req, h) => {
    try {

        const adminId = req.userId
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" }).code(404);
        }


        const { name, username, email, mobile, isActive, user_type, gender } = req.payload;

        if (!name) {
            return h.response({ status: 404, message: "Name is required" }).code(404);
        }
        if (!username) {
            return h.response({ status: 404, message: "username is required" }).code(404);
        }
        if (!email) {
            return h.response({ status: 404, message: "Email is required" }).code(404);
        }

        if (!mobile) {
            return h.response({ status: 404, message: "Mobile is required" }).code(404);
        }
        if (!gender) {
            return h.response({ status: 404, message: "Gender is required" }).code(404);
        }

        const id = req.params.id;
        // hash password 
        // const hashPassword = await bcrypt.hash(password, 10);

        const updatedUserData = await prisma.User.update({
            where: {
                id: Number(id)
            },
            data: {
                name, username, email, mobile, isActive, user_type, gender,
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
            return h.response({ status: 404, message: "You are not an Admin" }).code(404);
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

        return h.response({ status: 200, msg: "User deleted successfully" }).code(200);
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

        console.log(existingUser)

        if (!existingUser) {
            return h.response({ status: 404, message: "User not found" });
        } else {

            if (existingUser.isActive == true) {
                const isMatch = await bcrypt.compare(password, existingUser.password);
                if (!isMatch) {
                    return h.response({ message: "Invalid password" }).code(400);
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
// const userProfile = async (req, h) => {
//     try {
//         const userId = req.myUserId

//         if (!userId) {
//             return h.response({ status: 404, message: "You are not Approved user till now" });
//         }

//         const adminId = req.userId
//         if (!adminId) {
//             return h.response({ status: 404, message: "You are not an Admin" }).code(404);
//         }

//         const { id } = req.params;
//         const userData = await prisma.User.findFirst({
//             where: {
//                 id: Number(id)
//             },
//             select: {
//                 id: true,
//                 name: true,
//                 username: true,
//                 email: true,
//                 mobile: true,
//                 isActive: true,
//                 user_type: true,
//                 admin_id: true,
//             },
//         });

//         return h.response({ success: true, status: 200, data: userData });


//     } catch (error) {
//         console.log(error);
//         return h.response({ status: 500, message: "Error showing User's profile" });
//     }
// }

const userProfile = async (req, h) => {
    try {
        const userId = req.myUserId;
        const adminId = req.userId;
        console.log(adminId)
        // if (!adminId || !userId) {
        //     return h.response({ status: 404, message: "You are not authorized" }).code(404);
        // }

        const { id } = req.params;
        if (adminId) {
            const userData = await prisma.User.findFirst({
                where: {
                    OR: [
                        {
                            id: Number(id),
                            admin_id: adminId,
                        },
                        {
                            id: Number(id),
                            id: userId,
                        },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    gender: true,
                    mobile: true,
                    isActive: true,
                    user_type: true,
                    admin_id: true,
                },
            });
            return h.response({ success: true, status: 200, data: userData });
        } else if (userId) {
            const userData = await prisma.User.findFirst({
                where: {
                    OR: [
                        {
                            id: Number(id),
                            admin_id: adminId,
                        },
                        {
                            id: Number(id),
                            id: userId,
                        },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    gender: true,
                    mobile: true,
                    isActive: true,
                    user_type: true,
                    admin_id: true,
                },
            });
            return h.response({ success: true, status: 200, data: userData });
        } else {
            return h.response({ status: 404, message: "You are not authorized" }).code(404);
        }


        // return h.response({ success: true, status: 200, data: userData });
    } catch (error) {
        console.error(error);
        return h.response({ status: 500, message: "Error showing user's profile" });
    }
};

// user profile only for user 
const userSelfProfile = async (req, h) => {
    try {
        const userId = req.myUserId;
        if (!userId) {
            return h.response({ status: 404, message: "You are not authorized" }).code(404);
        }

        const user = await prisma.User.findFirst({
            where: {
                id: Number(userId)
            }
        });

        return h.response({ success: true, status: 200, data: user }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ status: 500, message: "Error showing profile" });
    }
}

// password reset
const userResetPassword = async (req, h) => {
    try {
        const { oldPassword, newPassword } = req.payload;
        const userId = req.myUserId;
        if (!userId) {
            return h.response({ status: 404, message: "You are not logged-in.Please sign-n first" }).code(404);
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, req.myRootUser.password);
        if (!isPasswordValid) {
            return h.response({ success: false, message: "Password didn't match" }).code(203);
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatePassword = await prisma.User.update({
                where: {
                    email: req.myRootUser.email
                },
                data: {
                    password: hashedPassword
                }
            });
            return h.response({ status: 200, success: true, message: "Password changed successfully!", data: updatePassword }).code(200);
        }
    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error while user password reset!" }).code(500);
    }
}

// update isActive status
const updateUserIsActiveStatus = async (req, h) => {
    try {
        const adminId = req.userId;
        if (!adminId) {
            return h.response({ status: 404, message: "You are not an Admin" });
        }

        const { id } = req.params;
        const { isActive } = req.payload;
        const updateStatus = await prisma.User.update({
            where: {
                id: Number(id),
            },
            data: {
                isActive: isActive
            }
        });

        return h.response({ status: 200, success: true, message: "Status changed successfully!" }).code(200);
    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error while user isActive status update!" }).code(500);
    }
}

// my-projects
const myProjects = async (req, h) => {
    try {
        const userId = req.myUserId;
        if (!userId) {
            return h.response({ status: 404, message: "You are not logged-in.Please sign-n first" }).code(404);
        }

        const projects = await prisma.Task.findMany({
            where: {
                user_id: Number(userId)
            }
        });
        return h.response({ success: true, data: projects }).code(200);
    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error while getting user's projects!" }).code(500);
    }
};
// get a single project by Id
const myProjectById = async (req, h) => {
    try {
        const { id } = req.params;

        const userId = req.myUserId;
        if (!userId) {
            return h.response({ status: 404, message: "You are not logged-in.Please sign-n first" }).code(404);
        }

        const project = await prisma.task.findFirst({
            where: {
                id: Number(id)
            }
        });
        return h.response({ success: true, data: project }).code(200);
    } catch (error) {
        console.log(error);
        return h.response({ status: 500, message: "Error while getting user's projects by Id !" }).code(500);
    }
}


module.exports = {
    createUser,
    updateUser,
    deleteUserById,
    userLoginAfterApproval,
    userProfile,
    userResetPassword,
    updateUserIsActiveStatus,
    userSelfProfile,
    myProjects,
    myProjectById
}
