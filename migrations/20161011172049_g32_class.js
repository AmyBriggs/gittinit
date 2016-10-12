'use strict';

exports.up = (knex) => {
  return knex.schema.dropTableIfExists(`g32`).then(() => {
    return knex.schema.createTable(`g32`, (table) => {
      table.increments();
      table.string(`username`).notNullable().unique();
      table.string(`name`).notNullable();
      table.string(`avatar`).notNullable();
      table.timestamps(true, true);
    });
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(`g32`);
};
