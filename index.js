'use strict';

const Hapi = require('@hapi/hapi');
const dotenv = require("dotenv")
const adminRoute = require("./Routes/AdminRoute")
const userRoute = require("./Routes/UserRoute")
const taskRoute = require("./Routes/TaskRoute")
// dotenv 
dotenv.config();

const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: process.env.HOST || 'localhost'
});

const init = async () => {
    await server.start();
    console.log('Server running on %s', server.info.uri);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return '<h3>Hello!</h3>'
        }
    });

    await server.route(adminRoute);
    await server.route(userRoute)
    await server.route(taskRoute)
};

init();
