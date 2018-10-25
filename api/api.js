const fs = require("fs")

const sql = require("sqlite3").verbose()
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "api.db"
  },
  useNullAsDefault: true
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

  db.exec(fs.readFileSync("init.sql", "utf-8"))

  db.close(err => {
    if (err) console.log("Failed to close database")
  })
}

function getRoutes(callback) {
  knex
    .select("route", "action")
    .from("routes")
    .where({ method: "GET" })
    .then(rows => callback(rows))
    .catch(err => console.log(err))
}

function registerRoute(
  database = 1,
  route = "wah",
  action = '{"toReturn": ["route", "method"], "from": ["routes"]}',
  callback,
  method = "GET"
) {
  knex("routes")
    .insert({
      database: database,
      route: route,
      action: action,
      method: method
    })
    .then(res => callback(true))
    .catch(err => callback(false, err))
}

function getValuesFromTargetDatabase(action, callback) {
  toReturn = []
  from = []
  Object.keys(action).forEach(function(key) {
    switch (key) {
      case "toReturn":
        toReturn = action["toReturn"]

      case "from":
        from = action["from"]
        break

      default:
        console.log("Nothing")
        break
    }
  })
  knex
    .select(...toReturn)
    .from(...from)
    .then(
      rows => {
        callback(rows)
      },
      err => {
        console.log(err)
      }
    )
}

module.exports.setup = setupAPIDatabase
module.exports.routes = getRoutes
module.exports.register = registerRoute
module.exports.return = getValuesFromTargetDatabase
