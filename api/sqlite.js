module.exports = target => {
  return require('knex')({
    client: "sqlite3",
    connection: {
      filename: target.url
    },
    useNullAsDefault: true
  })
}