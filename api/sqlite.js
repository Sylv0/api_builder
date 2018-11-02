let api = {}

api['knex'] = target => {
  return require('knex')({
    client: "sqlite3",
    connection: {
      filename: target.url
    },
    useNullAsDefault: true
  })
}

api['getTables'] = () => {
  return "Tables"
}
 
module.exports = api