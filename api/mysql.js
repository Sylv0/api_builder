module.exports = target => {
    return require('knex')({
        client: 'mysql',
        connection: {
          host : target.url,
          user : target.username,
          password : target.password,
          database : target.name
        }
      });
  }