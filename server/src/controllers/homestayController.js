const moment = require('moment');

const { listGeomHomestay, listHomestayByRadius, listAllHomestay, availableHomestay, bookedHomestay } = require("../services/homestay.js")

const listGeomHomestayController = async() => {
  return await listGeomHomestay()
}

const listHomestayByRadiusController = async(payload) => {
  return await listHomestayByRadius(payload)
}

const listAllHomestayController = async() => {
  return await listAllHomestay()
}

const availableHomestayController = async(params) => {
  let { checkin_date, max_day } = params
  checkin_date = moment(checkin_date).utc().format('YYYY-MM-DD')
  let checkout_date = checkin_date
  if (max_day > 2) checkout_date = moment(checkin_date).utc().add(max_day-2).format('YYYY-MM-DD')
  return await availableHomestay({ checkin_date, checkout_date })
}

const bookedHomestayController = async(params) => {
  return await bookedHomestay(params)
}

module.exports = { listGeomHomestayController, listHomestayByRadiusController, listAllHomestayController, availableHomestayController
  ,bookedHomestayController, 
 }