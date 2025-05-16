const { listAllReferralController, referralByIdController, addReferralProofController, verifyCodeReferralController, addCodeReferralController, listAllReferralByUserIdController, myReferralByIdController, confirmationReferralProofController } = require("../controllers/referralController");

const listAllReferralHandler = async(req, res) => {
  try {
    const data = await listAllReferralController()

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const listAllReferralByUserIdHandler = async(req, res) => {
  try {    
    const data = await listAllReferralByUserIdController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const referralByIdHandler = async(req, res) => {
  try {
    const data = await referralByIdController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const myReferralByIdHandler = async(req, res) => {
  try {
    const data = await myReferralByIdController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const addReferralProofHandler = async(req, res) => {
  try {
    const data = await addReferralProofController(req.body)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const confirmationReferralProofHandler = async(req, res) => {
  try {
    const data = await confirmationReferralProofController(req.body)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const verifyCodeReferralHandler = async(req, res) => {
  try {
    const data = await verifyCodeReferralController(req.params)
    if (!data) { // Cek undefined atau null
      return res.status(400).json({ status: 'failed', msg: 'Code Referral is not available' });
    }
    res.status(200).json({ status: 'success', data: data })
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', msg: 'An error occurred while verifying the referral code' });
  }
}

const addCodeReferralHandler = async(req, res) => {
  try {
    const data = await addCodeReferralController(req.body)
    if (data.status == 'failed') {
      return res.status(400).json({ status: 'failed', msg: data.msg });
    }
    res.status(201).json({ status: 'success' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', msg: 'An error occurred while verifying the referral code' });
  }
}

module.exports = {
  listAllReferralHandler, referralByIdHandler, addReferralProofHandler, verifyCodeReferralHandler
  , addCodeReferralHandler, listAllReferralByUserIdHandler, myReferralByIdHandler, confirmationReferralProofHandler, 
}