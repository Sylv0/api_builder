const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
let router = undefined

app.use((req, res, next) => {
  router(req, res, next)
})

app.use(cors())

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const api = require("./api/api")

function openEndpoints(api) {
  router = express.Router()
  api.routes()
  .then(data => {
    data.map(route => {
      app.get(`/api/${route.route}`, (req, res) => {
        api.target(route.database)
        .then(() => {
          api.return(JSON.parse(route.action))
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

app.post("/build/register", (req, res) => {
  api.register(req.body.database, req.body.route, req.body.action)
  .then(data => {
    res.send("Saved route")
    openEndpoints(api)
  })
  .catch(err => res.send(`Failed to save route, responded with message:\n${err}`))
})

app.get("/build/databases", (req, res) => {
  api.databases()
  .then(
    rows => res.send(rows)
  )
  .catch(err => res.send(err))
})

app.get("/build/routes", (req, res) => {
  api.routes()
  .then(
    rows => res.send(rows)
  )
  .catch(err => res.send(err))
})