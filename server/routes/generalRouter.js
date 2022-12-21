const express = require('express');
const generalRouter = express.Router();
const controller = require('../controller/controller');

generalRouter.get('/', controller.index);

module.exports = generalRouter;