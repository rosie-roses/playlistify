const express = require('express');
const router = express.Router();
const services = require('../services/render');

router.get("/", services.indexRoute);

router.get("/register", services.registerRoute);

module.exports = router;