// let api = {}

// api["knex"] = target => {
//   return require("knex")({
//     client: "mysql",
//     connection: {
//       host: target.url,
//       user: target.username,
//       password: target.password,
//       database: target.name
//     }
//   })
// }

class API {
  constructor(target) {
    this.knex = require("knex")({
      client: "mysql",
      connection: {
        host: target.url,
        user: target.username,
        password: target.password,
        database: target.name
      }
    })
  }

  tables(database = null) {
    return new Promise((resolve, reject) => {
      this.knex
        .select("table_name as name")
        .from("information_schema.tables")
        .where("table_schema", "=", database)
        .then(data => {
          console.log(data)
          resolve(data)
        })
        .catch(reject)
    })
  }

  columns(database, table) {
    return new Promise((resolve, reject) => {
      this.knex
        .select("column_name as name")
        .from("information_schema.columns")
        .where("table_schema", "=", database)
        .andWhere("table_name", "=", table)
        .then(data => {
          console.log(data)
          resolve(data)
        })
        .catch(reject)
    })
  }
}

module.exports = API
