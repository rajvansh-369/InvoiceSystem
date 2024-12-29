const express = require('express');
const { getLedger, updateLedger,editLedger,createLedger,viewLedger} = require('../controllers/ledger')
const router = express.Router();


router.get("/", getLedger);
router.get("/edit/:ledgerId", editLedger);
router.get("/view/:ledgerId", viewLedger);
router.post("/create", createLedger);
router.post("/update", updateLedger);
// router.post("/editLedger", editLedger);
module.exports = router;
