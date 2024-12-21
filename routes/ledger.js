const express = require('express');
const { getLedger, updateLedger,editLedger,createLedger} = require('../controllers/ledger')
const router = express.Router();


router.get("/", getLedger);
router.post("/create", createLedger);
router.post("/update", updateLedger);
router.post("/editProdut", editLedger);
module.exports = router;
