module.exports = class Sqlite {
  constructor(path) {
    console.log("SSqslite")
    this.knex = require("knex")({
      client: "sqlite3",
      connection: {
        filename: path
      },
      useNullAsDefault: true
    })
  }
}
