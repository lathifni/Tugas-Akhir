const { getListAllBasePackage } = require("../services/package")

const getAllBasePackageController = async() => {
  return await getListAllBasePackage()
}

module.exports = { getAllBasePackageController, }