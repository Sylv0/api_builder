const express = require("express")

const app = express()

const api = require("./api/api")

app.listen(3000)

api.setup()
api.routes(data => {
  data.forEach(route => {
    app.get(`/api/${route.route}`, (req, res) => {
      api.return(JSON.parse(route.action), data => {
        res.send(data)
      })
    })
  })
})

app.get("/", (req, res) => {
  res.send("<h1>API Builder</h1><p>Documentation to come</p>")
})

app.get("/build/register", (req, res) => {
  api.register(req.query.database, req.query.route, req.query.action, registered => {
    res.send((registered ? "Saved route" : "Failed to save route"))
  })
})
