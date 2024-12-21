// const User = require('../models/user');
const db = require("../models/all-models");
const User = require("../models/user");

async function getUser(req, res) {
    // const allDbUser = await User.find({});
    const allDbUser = await User.findOne();
    heading = "Test Data";
    res.render('pages/user', { allDbUser, heading: heading });
}

async function test(req, res) {
    const allDbUser = await User.find({});

    heading = "Test Data";
    res.render('pages/test', { eventData: await User.find({}), heading: heading });
}

module.exports = {
    getUser,
    test
}