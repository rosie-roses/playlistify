const express = require('express');
const generalRouter = express.Router();
const controller = require('../controller/controller');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

generalRouter.get('*', checkUser); // Apply checkUser middleware to every single GET request.
generalRouter.get('/', controller.index);
generalRouter.get('/profile', requireAuth , controller.profile);

module.exports = generalRouter;