const express = require('express');
const {getUser,test} = require('../controllers/user')
const router = express.Router();

router.get("/", getUser);
router.get("/test", test);

module.exports = router;
