const createReservationController = async (params) => {
  console.log(params);
  const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

  const currentDate = new Date();
  console.log(currentDate);

  const paramter = {
    transaction_details: {
      order_id: currentDate,
      gross_amount: params.total,
    },
    customer_details: {
      first_name: params.name,
      // email: req.body.email,
    },
    // usage_limit:  1,
    // expiry: {

    // }
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

module.exports = {
  createReservationController,
};
