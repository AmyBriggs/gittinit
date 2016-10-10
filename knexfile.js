'use strict';

module.exports = {
  development: {
    client: `pg`,
    connection: `postgres://localhost/gittinit`,
  },
  production: {
    client: `pg`,
    connection: `${process.env.DATABASE_URL}?ssl=true`,
  },
};
