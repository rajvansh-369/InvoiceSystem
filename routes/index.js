const express = require('express');
const {getUser,test} = require('../controllers/user')

const router = express.Router();

router.get("/", (req, res) => {res.render('pages/index')});


router.get("/test", test);

module.exports = router;
