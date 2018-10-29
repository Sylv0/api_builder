module.exports = path => {
  return require('knex')({
    client: "sqlite3",
    connection: {
      filename: path
    },
    useNullAsDefault: true
  })
}