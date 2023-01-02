const express = require('express');
const authRouter = express.Router();
const controller = require('../controller/controller');
const passport = require('passport');

authRouter.get("/register", controller.register_get);
authRouter.post("/register", controller.register_post);
authRouter.get("/login", controller.login_get);
authRouter.post("/login", controller.login_post);
authRouter.get("/logout", controller.logout_get);
authRouter.get("/auth/google", passport.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: '/' }), controller.google_callback_get);

module.exports = authRouter;