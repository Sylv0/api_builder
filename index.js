const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const removeRoute = require("./utils/remove-route")

const app = express()
let router = undefined

app.use((req, res, next) => {
  router(req, res, next)
})

app.use(cors())
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
)

const api = require("./api/api")

function openEndpoints(api) {
  router = express.Router()
  api.routes().then(data => {
    data.map(route => {
      app.get(`/api/${route.route}`, (req, res) => {
        api
          .target(route.database)
          .then(() => {
            api
              .return(JSON.parse(route.action))
              .then(data => {
                res.send(data)
              })
              .catch(err => res.send(err))
          })
          .catch(err => res.send(err))
      })
    })
  })
}

app.listen(3000)

api.setup()
openEndpoints(api)

app.post("/build/register/database", (req, res) => {
  api
    .registerDatabase(
      req.body.name,
      req.body.url,
      req.body.type,
      req.body.user,
      req.body.pass
    )
    .then(data => {
      res.send({ message: "Saved database", route: req.body })
      openEndpoints(api)
    })
    .catch(err => {
      res.status(500)
      res.send({ message: err.code, route: req.body })
    })
})

app.get("/build/remove/database/:id", (req, res) => {
  api.routes()
  .then(data => data.filter(a => a.database.toString() === req.params.id).forEach(a => {
    removeRoute(app, "/api/" + a.route)
  }))
  .catch(console.log)
  api
    .unregisterDatabase(req.params.id)
    .then(data => {
      if (data) res.send("Removed")
      else res.send("Nothing to remove")
      openEndpoints(api)
    })
    .catch(error => res.send(error))
})

app.post("/build/register/route", (req, res) => {
  api
    .registerRoute(req.body.database, req.body.route, req.body.action)
    .then(data => {
      res.send({ message: "Saved route" })
      openEndpoints(api)
    })
    .catch(err => {
      res.status(500)
      res.send({
        message: `Failed to save route, responded with message:\n${err}`
      })
    })
})

app.get("/build/remove/route/:id", (req, res) => {
  api.routes()
  .then(data => removeRoute(app, "/api/" + data.filter(a => a.id.toString() === req.params.id)[0].route))
  .catch(console.log)
  api
    .unregisterRoute(req.params.id)
    .then(data => {
      if (data) res.send("Removed")
      else res.send("Nothing to remove")
      openEndpoints(api)
    })
    .catch(error => res.send(error))
})

app.get("/build/databases", (req, res) => {
  api
    .databases()
    .then(rows => res.send(rows))
    .catch(err => res.send(err))
})

app.get("/build/tables/:id", (req, res) => {
  api
    .tables(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.send(err))
})

app.get("/build/columns/:id/:table", (req, res) => {
  api
    .columns(req.params.id, req.params.table)
    .then(data => res.send(data))
    .catch(err => res.send(err))
})

app.get("/build/routes", (req, res) => {
  api
    .routes()
    .then(rows => res.send(rows))
    .catch(err => res.send(err))
})
