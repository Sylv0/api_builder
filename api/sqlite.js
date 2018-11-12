// let api = {}

// api['knex'] = target => {
//   return require('knex')({
//     client: "sqlite3",
//     connection: {
//       filename: target.url
//     },
//     useNullAsDefault: true
//   })
// }

// api['getTables'] = () => {
//   return "Tables"
// }

class API {
  constructor(target) {
    this.knex = require("knex")({
      client: "sqlite3",
      connection: {
        filename: target.url
      },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
      }
    })
  }

  tables(database = null) {
    return new Promise((resolve, reject) => {
      this.knex.select("name").from("sqlite_master").whereNot("name", "=", "sqlite_sequence").andWhere("type", "=", "table")
      .then(data => {
        console.log(data)
        resolve(data)
      })
      .catch(reject)
    })
  }
}

module.exports = API
