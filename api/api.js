'use strict'

const fs = require("fs")

const sql = require("sqlite3").verbose()

const knex = new require('./sqlite')('api.db')

const setupAPIDatabase = () => {
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

function getDatabases() {
  return new Promise((resolve, reject) => {
    knex.select().from("databases").then(rows => resolve(rows)).catch(err => reject(err))
  });
}

function getRoutes() {
  return new Promise((resolve, reject) => {
    knex
    .select("route", "action")
    .from("routes")
    .where({ method: "GET" })
    .then(rows => resolve(rows))
    .catch(err => reject(err))
  })
}

function registerRoute(
  database = 1,
  route = "wah",
  action = '{"toReturn": ["route", "method"], "from": ["routes"]}',
  method = "GET"
) {
  return new Pormise((resolve, reject) => {
    knex("routes")
    .insert({
      database: database,
      route: route,
      action: action,
      method: method
    })
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}

function getValuesFromTargetDatabase(action) {
  return new Promise((resolve, reject) => {
    let toReturn = []
    let from = []
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
        console.log("Test")
        resolve(rows)
      },
      err => {
        reject(err)
      }
      )
    })
  }

module.exports.setup = setupAPIDatabase
module.exports.routes = getRoutes
module.exports.register = registerRoute
module.exports.return = getValuesFromTargetDatabase
