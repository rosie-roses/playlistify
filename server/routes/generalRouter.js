const express = require('express');
const generalRouter = express.Router();
const controller = require('../controller/controller');
const { requireAuth } = require('../middleware/authMiddleware');

generalRouter.get('/', controller.index);
generalRouter.get('/profile', requireAuth , controller.profile);

module.exports = generalRouter;