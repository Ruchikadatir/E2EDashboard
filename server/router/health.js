const express = require("express");
const router = new express.Router();
const health = require("../service/health");
router.get("/", health.get);
//  Other handlers
// exports all routes
module.exports = router;
