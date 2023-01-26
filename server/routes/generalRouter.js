const express = require('express');
const generalRouter = express.Router();
const controller = require('../controller/controller');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

generalRouter.get('*', checkUser); // Apply checkUser middleware to every single GET request.
generalRouter.post('*', checkUser); // Apply checkUser middleware to every single POST request.
generalRouter.get('/', controller.index_get);
generalRouter.get('/profile', requireAuth , controller.profile_get);
generalRouter.get('/add-track', requireAuth, controller.addTrack_get);
generalRouter.post('/add-track', requireAuth, controller.addTrack_post);
generalRouter.get('/edit-track', requireAuth, controller.editTrack_get);
generalRouter.post('/edit-track', requireAuth, controller.editTrack_post);

module.exports = generalRouter;