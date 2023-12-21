const jwt = require('jsonwebtoken');
const prisma = require('../DB/DbConfig');
const SECRET = process.env.SECRET

const UserAuth = async (req, h) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return h.response({ status: 400, message: "No token provided" });
        } else {
            const verifytoken = jwt.verify(token, SECRET);
            // console.log("Token verification : ", verifytoken)


            const rootUser = await prisma.User.findFirst({ where: { email: verifytoken.email } });
            // console.log("Root_User", rootUser)


            if (!rootUser) { throw new Error("rootUser not found") }

            req.myToken = token
            req.myRootUser = rootUser
            req.myUserId = rootUser.id

            // next();
            return req
        }



    } catch (error) {
        console.error('Authentication error:', error);
        return h.response({ message: "Unauthorized User!", error }).code(400);
    }
}

module.exports = [UserAuth]