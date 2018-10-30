const express = require("express")

const app = express()
let router = undefined

app.use((req, res, next) => {
  router(req, res, next)
})

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


app.get("/", (req, res) => {
  res.send("<h1>API Builder</h1><p>Documentation to come</p>")
})

app.get("/build/register", (req, res) => {
  api.register(req.query.database, req.query.route, req.query.action)
  .then(res => {
    res.send("Saved route")
    openEndpoints(api)
  })
  .catch(err => res.send(`Failed to save route, responded with message:\n${err}`))
})
