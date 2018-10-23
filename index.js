const express = require("express")

const app = express()

const api = require("./api/api")

app.listen(3000)

api.setup()
api.routes(data => {
  data.forEach(route => {
    app.get(`/api/${route.route}`, (req, res) => {
      res.send(route.route)
    })
  })
})

app.get("/", (req, res) => {
  res.send("<h1>API Builder</h1><p>Documentation to come</p>")
})

app.get("/build/register", (req, res) => {
  api.register(req.query.route, req.query.action, registered => {
    res.send((registered ? "Saved route" : "Failed to save route"))
  })
})
