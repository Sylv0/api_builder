"use strict"

const fs = require("fs")

const sql = require("sqlite3").verbose()

const knex = new require("./sqlite")({url: "api.db"})
let target

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

function getDatabases(database) {
  return new Promise((resolve, reject) => {
    let query = knex.select().from("databases")
    if (database) query.where("id", "=", database)

    query.then(rows => resolve(rows)).catch(err => reject(err))
  })
}

function setTargetDatabase(database) {
  target = null;
  return new Promise((resolve, reject) => {
    getDatabases(database).then(newTarget => {
      target = require(`./${newTarget[0].type}.js`)(newTarget[0])
      if(target) resolve()
      else reject()
    })
  })
}

function getRoutes() {
  return new Promise((resolve, reject) => {
    knex
      .select()
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
  return new Promise((resolve, reject) => {
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
    let query = target.from(...action['from'])
    Object.keys(action).forEach(function(key) {
      switch (key) {
        case "toReturn":
          query.select(action["toReturn"])
        case "limit":
          query.limit(action["limit"])
        default:
          query.select()
          break
      }
    })
      query.then(rows => {
        resolve(rows)
      })
      .catch(err => reject(err))
  })
}

module.exports.setup = setupAPIDatabase
module.exports.routes = getRoutes
module.exports.registerRoute = registerRoute
module.exports.return = getValuesFromTargetDatabase
module.exports.target = setTargetDatabase
module.exports.databases = getDatabases