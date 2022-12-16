const express = require('express');
const generalRouter = express.Router();
const services = require('../services/render');

generalRouter.get("/", services.indexRoute);

module.exports = generalRouter;