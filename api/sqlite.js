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
      useNullAsDefault: true
    })
  }

  tables(database = null) {
    return new Promise((resolve, reject) => {
      this.knex.select("name").from("sqlite_master").whereNot("name", "=", "sqlite_sequence").andWhere("type", "=", "table")
      .then(resolve)
      .catch(reject)
    })
  }
}

module.exports = API
