const {
  getListReservationByUserId,
  getReservationById,
  getServiceByReservationId,
  getActivityByReservationId,
  getLatestIdReservation,
  createReservation,
  callbackRedirect,
  updateReservationInformation,
  getReservationAfterDeposit,
  updateAfterFullPaymentReservationInformation,
} = require("../services/reservation");
const crypto = require("crypto");

const createReservationController = async (params) => {
  const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

  const latestIdReservation = await getLatestIdReservation();
  let lastIdNumber = latestIdReservation.lastIdNumber;

  let idReservation, idDownPayment, idRepayment;
  lastIdNumber++;
  const idNumberString = lastIdNumber.toString().padStart(4, "0");
  idReservation = `RTeeesttttttttt${idNumberString}`;
  idDownPayment = `DPTeeesttttttttt${idNumberString}`;
  // idRepayment = `RP${idNumberString}`
  // return `P${idNumberString}`;

  // const createReservation = await

  const paramter = {
    transaction_details: {
      order_id: idDownPayment,
      // gross_amount: params.total,
      gross_amount: 800000,
    },
    customer_details: {
      first_name: params.name,
      email: params.email,
    },
    usage_limit: 1,
    expiry: {
      duration: 1,
      unit: "days",
    },
    item_details: [
      {
        id: "P0090",
        name: "Family and Community Gathering",
        price: 1000000,
        quantity: 1,
      },
      {
        name: "down payment",
        price: -200000,
        quantity: 1,
      },
    ],
  };

  const response = await fetch(`${process.env.MIDTRANS_APP_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify(paramter),
  });

  if (response.status == 201) {
    const dataResponse = await response.json();
    const token = dataResponse.token;
    const status = 201;
    const data = {
      id: idReservation,
      user_id: params.user_id,
      package_id: params.package_id,
      dp_id: idDownPayment,
      request_date: params.request_date,
      check_in: params.check_in,
      total_people: params.total_people,
      token_midtrans: token,
      note: "ini sebuah note",
      rating: 0,
      status: 1,
      deposit: 160000,
      total_price: 800000,
    };
    await createReservation(data);
    return { token, status };
  }
  const status = response.status;
  const dataResponse = await response.json();
  const { error_messages } = dataResponse;
  return { error_messages, status };
};

const getListReservationByUserIdController = async (params) => {
  return await getListReservationByUserId(params);
};

const getReservationByIdController = async (params) => {
  const listService = await getServiceByReservationId(params);
  const listActivity = await getActivityByReservationId(params);
  const dataReservation = await getReservationById(params);

  return {
    reservation: dataReservation[0],
    service: listService,
    activity: listActivity,
  };
};

const callbackNotificationController = async (params) => {
  const { order_id, status_code, transaction_status } = params;
  const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
  // console.log(id, 'ini idnya yah');
  const hash = crypto
    .createHash("sha512")
    .update(
      `${params.order_id}${params.status_code}${params.gross_amount}${SERVER_KEY}`
    )
    .digest("hex");
  if (hash == params.signature_key) {
    if (
      params.transaction_status == "settlement" ||
      params.transaction_status == "capture"
    ) {
      if (order_id.startsWith("DP")) {
        let id = order_id;
        id = id.replace(/^DP/, "R");
        const dataReservation = await getReservationAfterDeposit(id);

        const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);
        const parameterAskPayment = {
          transaction_details: {
            order_id: dataReservation.id,
            // gross_amount: params.total,
            gross_amount: dataReservation.total_price - dataReservation.deposit,
          },
          customer_details: {
            first_name: dataReservation.fullname,
            email: dataReservation.email,
          },
          usage_limit: 1,
          expiry: {
            duration: 1,
            unit: "days",
          },
          item_details: [
            {
              id: dataReservation.package_id,
              name: dataReservation.name,
              price: dataReservation.total_price,
              quantity: 1,
            },
            {
              name: "down payment",
              price: -dataReservation.deposit,
              quantity: 1,
            },
          ],
        };
        console.log(parameterAskPayment);
        const responseAskPayment = await fetch(
          `${process.env.MIDTRANS_APP_URL}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Basic ${authString}`,
            },
            body: JSON.stringify(parameterAskPayment),
          }
        );
        if (responseAskPayment.status == 201) {
          const dataResponse = await responseAskPayment.json();
          const token = dataResponse.token;
          console.log(token, "ini token barunya");
          const dataUpdate = {
            paymentDate: params.transaction_time,
            token: token,
            status_id:'2',
            id: id,
          };
          await updateReservationInformation(dataUpdate);
        }
      }
      else {
        console.log('ini di bagian reservation, id R depannya');
        const dataUpdate = {
          paymentDate: params.transaction_time,
          // token:token,
          status_id:'3',
          id: order_id,
        };
        await updateAfterFullPaymentReservationInformation(dataUpdate);
      }
    } else if (params.transaction_status == "pending")
      console.log("waiting for payment");
    else if (params.transaction_status == "deny")
      console.log("payment is deny");
    else if (params.transaction_status == "cancel")
      console.log("payment is canceled");
    else if (params.transaction_status == "expire")
      console.log("payment is timeout");
    else if (params.transaction_status == "refund")
      console.log("payment has refund");
    else console.log("transactions is fail");
  }
};

const callbackRedirectController = async (params) => {
  return await callbackRedirect(params);
};

module.exports = {
  createReservationController,
  getListReservationByUserIdController,
  getReservationByIdController,
  callbackNotificationController,
  callbackRedirectController,
};
