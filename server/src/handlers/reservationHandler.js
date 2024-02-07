// import midtransClient from 'midtrans-client'
var midtransClient = require("midtrans-client");

const postReservation = async (req, res) => {
  console.log(process.env.MIDTRANS_SERVER_KEY);
  console.log(req.body);
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
    const paramter = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.total,
      },
      customer_details: {
        first_name: req.body.name,
      },
    };
    snap.createTransaction(paramter).then((transaction) => {
      const dataPayment = {
        response: JSON.stringify(transaction),
      };
      const token = transaction.token;
      console.log('token: ', transaction.token);

      res.status(200).send({ message: "success", dataPayment, token: token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

module.exports = { postReservation };
