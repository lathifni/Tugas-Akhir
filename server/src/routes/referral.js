var express = require('express');
const { listAllReferralHandler, referralByIdHandler, addReferralProofHandler, verifyCodeReferralHandler, addCodeReferralHandler, listAllReferralByUserIdHandler, myReferralByIdHandler, confirmationReferralProofHandler } = require('../handlers/referralHandler');

var router = express.Router();

router.get('/list-all', listAllReferralHandler)
router.get('/list-all-by-user-id/:user_id', listAllReferralByUserIdHandler)
router.get('/by-id/:id', referralByIdHandler)
router.get('/my-referral/:id', myReferralByIdHandler)
router.put('/add-referral-proof', addReferralProofHandler)
router.put('/confirmation', confirmationReferralProofHandler)
router.get("/verify/:code_referral", verifyCodeReferralHandler)
router.post('/', addCodeReferralHandler)

module.exports = router