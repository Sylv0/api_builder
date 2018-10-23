const fs = require("fs")

const sql = require("sqlite3").verbose()
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "api.db"
  }
})

setupAPIDatabase = () => {
  let db = new sql.Database(
    "api.db",
    sql.OPEN_READWRITE | sql.OPEN_CREATE,
    err => {
      if (err) {
        console.log("There was an error opening or creating the database.")
        console.log(err)
        db.close()
        return
      }
    }
  )

  db.run(fs.readFileSync("init.sql", "utf-8"))

  db.close(err => {
    if (err) console.log("Failed to close database")
  })
}

function getRoutes(callback) {
  let db = new sql.Database("api.db", sql.OPEN_READONLY)
  let data = []
  db.each(
    "SELECT route, action FROM routes WHERE method='GET'",
    (err, row) => {
      if (!err) data.push(row)
      else data = "Not wah"
    },
    () => {
      db.close()
      callback(data)
    }
  )
}

function registerRoute(route, action, callback, method = "GET") {
  let db = new sql.Database("api.db", sql.OPEN_READWRITE)
  db.run(
    `INSERT INTO routes (route, method, action) VALUES ('${route}', '${method}', '${action}')`,
    () => {
      return
    },
    err => {
      callback(err ? false : true)
    }
  )
}

module.exports.setup = setupAPIDatabase
module.exports.routes = getRoutes
module.exports.register = registerRoute
