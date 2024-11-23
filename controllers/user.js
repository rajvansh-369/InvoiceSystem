const User = require('../models/user');
const db = require("../models/all-models");


async function getUser(req, res) {
    const allDbUser = await User.find({});

    heading = "Test Data" ;
    res.render('pages/index', { eventData: await User.find({}), heading : heading });
    
    console.log(await User.find({}),heading);
    // return res.json(allDbUser);
}

async function test(req, res) {
    const allDbUser = await User.find({});

    heading = "Test Data" ;
    res.render('pages/test', { eventData: await User.find({}), heading : heading });
    
    console.log(await User.find({}),heading);
    // return res.json(allDbUser);
}

module.exports = {
    getUser,
    test
}