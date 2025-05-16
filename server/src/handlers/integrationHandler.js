const { weatherForecastController, waterForecastController, weatherForecastByDateController, waterForecastByDateController } = require("../controllers/integrationController");

const weatherForecastHandler = async (req, res) => {
  try {
    const info = await weatherForecastController();

    return res.status(200).send({ status: "success", data: info });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const waterForecastHandler = async(req, res) => {
  try {
    const info = await waterForecastController();

    return res.status(200).send({ status: "success", data: info });
  } catch (error) {
    console.log(error);
    return error;
  }
}

const weatherForecastByDateHandler = async(req, res) => {
  try {
    const info = await weatherForecastByDateController(req.params);
    console.log(info);
    return res.status(200).send({ status: "success", data: info });
  } catch (error) {
    console.log(error);
    return error;
  }
}

const waterForecastByDateHandler = async(req, res) => {
  try {
    const info = await waterForecastByDateController(req.params);
    console.log(info);
    return res.status(200).send({ status: "success", data: info });
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
  weatherForecastHandler, waterForecastHandler, weatherForecastByDateHandler, waterForecastByDateHandler,
}