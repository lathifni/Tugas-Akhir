const mysql = require('mysql2')

const pool = mysql.createPool({
  host                : 'localhost',
  user                : 'root',
  password            : '',
  database            : 'new_gis_gtp',
})

const promisePool = pool.promise()

module.exports = promisePool

// module.exports = pool