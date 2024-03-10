const {
  getListReservationByUserId,
  getReservationById,
  getServiceByReservationId,
  getActivityByReservationId,
  getLatestIdReservation,
  createReservation,
  callbackRedirect,
} = require("../services/reservation");

const createReservationController = async (params) => {
  const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

  const latestIdReservation = await getLatestIdReservation();
  let lastIdNumber = latestIdReservation.lastIdNumber;

  let idReservation, idDownPayment, idRepayment;
  lastIdNumber++;
  const idNumberString = lastIdNumber.toString().padStart(4, "0");
  idReservation = `RTeeesttttttttt${idNumberString}`;
  idDownPayment = `DPTeesttt${idNumberString}`;
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
    const status = 201
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
      status: 0,
      deposit: 160000,
      total_price: 800000,
    };
    await createReservation(data);
    return { token, status };
  }
  const status = response.status
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

const callbackController = async() => {

}

const callbackRedirectController = async(params) => {
  return await callbackRedirect(params)
}

module.exports = {
  createReservationController,
  getListReservationByUserIdController,
  getReservationByIdController,
  callbackController,
  callbackRedirectController,
};
