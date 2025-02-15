const express = require('express');
const { getLedger, updateLedger,editLedger,createLedger,viewLedger,updateLedgerAPI,createLedgerView,viewLedgerPdf,sendWaReport,deleteLedger,deleteAttachedProduct} = require('../controllers/ledger')
const router = express.Router();


router.get("/", getLedger);
router.get("/edit/:ledgerId", editLedger);
router.get("/view/:ledgerId", viewLedger);
router.get("/view-pdf/:ledgerId", viewLedgerPdf);
router.get("/create", createLedgerView);
router.get("/delete/:ledgerId", deleteLedger);
router.post("/deleteAttachedProduct", deleteAttachedProduct);
router.post("/create", createLedger);
router.post("/update", updateLedger);
// router.post("/addProduct", addProductAPI);
router.post("/updateLedger", updateLedgerAPI);
router.get("/sendWaReport", sendWaReport);
module.exports = router;
