const { getListReservationByUserId, getReservationById, getServiceByReservationId, getActivityByReservationId } = require("../services/reservation");

const createReservationController = async (params) => {
  console.log(params);
  const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

  const currentDate = new Date();
  console.log(currentDate);

  const paramter = {
    transaction_details: {
      order_id: 'DP002',
      // gross_amount: params.total,
      gross_amount: 800000
    },
    customer_details: {
      first_name: params.name,
      email: params.email,
    },
    usage_limit:  1,
    expiry: {
      duration: 1,
      unit: 'days'
    },
    item_details: [{
      id: 'P0090',
      name: 'Family and Community Gathering',
      price: 1000000,
      quantity: 1
    },{
      name: 'down payment',
      price: -200000,
      quantity: 1
    }]
  };

  const response = await fetch(`${process.env.MIDTRANS_APP_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${authString}`
    },
    body: JSON.stringify(paramter)
  })
  return response
};

const getListReservationByUserIdController = async(params) => {
  return await getListReservationByUserId(params)
}

const getReservationByIdController = async(params) => {
  const listService = await getServiceByReservationId(params)
  const listActivity = await getActivityByReservationId(params)
  const dataReservation = await getReservationById(params)

  return {
    reservation: dataReservation[0],
    service: listService,
    activity: listActivity
  }
}

module.exports = {
  createReservationController, getListReservationByUserIdController, getReservationByIdController,
};
