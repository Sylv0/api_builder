const fs = require("fs")

const sql = require("sqlite3").verbose()
const knex = require("knex")

setupAPIDatabase = () => {
  let db = new sql.Database(
    "api.db",
    sql.OPEN_READWRITE | sql.OPEN_CREATE,
    err => {
      if (err) {
        console.log("There was an error opening or creating the database.")
        console.log(err)
        db.close();
      } else console.log("Database opened.")
    }
  )

  db.run(fs.readFileSync("init.sql", "utf-8"))

  db.close(err => {
    if(err) console.log("Failed to close database")
    else console.log("Closed conenction to database")
  })
}



module.exports.setup = setupAPIDatabase;