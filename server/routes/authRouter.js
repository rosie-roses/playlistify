const express = require('express');
const authRouter = express.Router();
const controller = require('../controller/controller');

authRouter.get("/register", controller.register_get);
authRouter.post("/register", controller.register_post);
authRouter.get("/login", controller.login_get);
authRouter.post("/login", controller.login_post);
authRouter.get("/logout", controller.logout_get);

module.exports = authRouter;