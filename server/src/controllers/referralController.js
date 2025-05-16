const { listAllReferral, referralById, addReferralProof, verifyCodeReferral, createCodeReferral, listAllReferralByUserId, myReferralById, confirmationReferralProof } = require("../services/referral");
const { getUserByUsernameOrEmail, searchUser, allPhoneAdmin } = require("../services/users");
const { sendMessagePaymentReferral, adminSendMessageReferralConfirmation } = require("./chatController");

const listAllReferralController = async() => {
  return await listAllReferral();
}

const listAllReferralByUserIdController = async(params) => {
  return await listAllReferralByUserId(params);
}

const referralByIdController = async(params) => {
  return await referralById(params)
}

const myReferralByIdController = async(params) => {
  return await myReferralById(params)
}

const addReferralProofController = async(params) => {
  const now = new Date();
  const currentDatetime = `${now.getFullYear()}-${String(now.getMonth() + 1)
    .padStart(2, '0')}-${String(now.getDate())
      .padStart(2, '0')} ${String(now.getHours())
        .padStart(2, '0')}:${String(now.getMinutes())
          .padStart(2, '0')}:${String(now.getSeconds())
            .padStart(2, '0')}`;
  params.datetime = currentDatetime,
  await sendMessagePaymentReferral()
  return addReferralProof(params)
}

const confirmationReferralProofController = async(params) => {
  if (params.status == '1') {
    const now = new Date();
    const currentDatetime = `${now.getFullYear()}-${String(now.getMonth() + 1)
      .padStart(2, '0')}-${String(now.getDate())
        .padStart(2, '0')} ${String(now.getHours())
          .padStart(2, '0')}:${String(now.getMinutes())
            .padStart(2, '0')}:${String(now.getSeconds())
              .padStart(2, '0')}`;
    params.datetime = currentDatetime
    const phoneAdminList = await allPhoneAdmin(); 
    for (const adminPhone of phoneAdminList) {
      // Pastikan nomor telepon admin valid
      if (adminPhone && adminPhone.phone) {
        // Tambahkan nomor telepon admin pada params
        params.phone = adminPhone.phone;
        // Kirim pesan ke admin
        await adminSendMessageReferralConfirmation(params);
      }
    }
    return await confirmationReferralProof(params)
  }
  const phoneAdminList = await allPhoneAdmin(); 
  for (const adminPhone of phoneAdminList) {
    // Pastikan nomor telepon admin valid
    if (adminPhone && adminPhone.phone) {
      // Tambahkan nomor telepon admin pada params
      params.phone = adminPhone.phone;
      // Kirim pesan ke admin
      await adminSendMessageReferralConfirmation(params);
    }
  }
  return await confirmationReferralProof(params)
}

const verifyCodeReferralController = async(params) => {
  return await verifyCodeReferral (params)
}

const addCodeReferralController = async(params) => {
  if (params.percentage_referral < 4 && params.percentage_referral > 25) {
    return {
      status: 'failed',
      msg: 'Please use percentage in range 5% - 25%'
    }
  }
  const emailOrUsername = params.username_email
  const user = await searchUser({emailOrUsername})
  if (!user) {
    return {
      status: 'failed',
      msg: 'Username or Email is incorrect'
    }
  }
  if (user.code_referral != null && user.percentage_referral != null) {
    return {
      status: 'failed',
      msg: `User already has a referral code: ${user.code_referral} with ${user.percentage_referral}% referral percentage.`
    }
  }
  await createCodeReferral({
    id: user.id,
    percentage_referral: params.percentage_referral
  })
  return { status: 'success'}
}

module.exports = {
  listAllReferralController, referralByIdController, addReferralProofController, verifyCodeReferralController
  , addCodeReferralController, listAllReferralByUserIdController, myReferralByIdController, confirmationReferralProofController, 
}