const users = require('../services/users')

const testDulu = async (payload) => {
    const data = await users.getDataUsers()
    return data[0]
}

module.exports = { testDulu }
