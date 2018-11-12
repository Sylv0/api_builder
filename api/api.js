"use strict"

const fs = require("fs")

const sql = require("sqlite3").verbose()

let API = require("./sqlite")
let api = new API({ url: "api.db" })
const knex = api.knex
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
      else {
        db.run('PRAGMA foreign_keys=on')
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

    query
      .then(rows => {
        if (rows.length > 0) resolve(rows)
        reject("No database")
      })
      .catch(err => reject(err))
  })
}

function setTargetDatabase(database) {
  target = null
  return new Promise((resolve, reject) => {
    getDatabases(database)
      .then(newTarget => {
        API = require(`./${newTarget[0].type}.js`)
        api = new API(newTarget[0])
        target = api.knex
        if (target) resolve()
        else reject()
      })
      .catch(err => {
        reject()
      })
  })
}

function getTables(id) {
  return new Promise((resolve, reject) => {
    setTargetDatabase(id)
      .then(() => {
        getDatabases().then(dbs => {
          api
            .tables(dbs.filter(db => db.id.toString() === id)[0].name)
            .then(resolve)
            .catch(console.log)
        })
      })
      .catch(err => reject(err))
  })
}

function getColumns(id, table) {
  return new Promise((resolve, reject) => {
    setTargetDatabase(id)
      .then(() => {
        target(table)
          .columnInfo()
          .then(resolve)
          .catch(reject)
      })
      .catch(err => reject(err))
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

function registerDatabase(name, url, type, username = "", password = "") {
  return new Promise((resolve, reject) => {
    knex("databases")
      .insert({
        name: name,
        url: url,
        type: type,
        username: username,
        password: password
      })
      .then(res => resolve(res))
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
    let query = target.from(...action["from"])
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
    query
      .then(rows => {
        resolve(rows)
      })
      .catch(err => reject(err))
  })
}

function unregisterDatabase(id) {
  return new Promise((resolve, reject) => {
      knex("databases").del().where("id", id)
      .then(resolve)
      .catch(reject)
  })
}

function unregisterRoute(id) {
  return new Promise((resolve, reject) => {
      knex("routes").del().where("id", id)
      .then(resolve)
      .catch(reject)
  })
}

module.exports.setup = setupAPIDatabase
module.exports.routes = getRoutes
module.exports.registerDatabase = registerDatabase
module.exports.unregisterDatabase = unregisterDatabase
module.exports.registerRoute = registerRoute
module.exports.unregisterRoute = unregisterRoute
module.exports.return = getValuesFromTargetDatabase
module.exports.target = setTargetDatabase
module.exports.databases = getDatabases
module.exports.tables = getTables
module.exports.columns = getColumns
