// API to the database
'use strict';

const knex = require(`./knex`);

const getUser = (username) => {
  return knex(`users`)
  .select(`*`)
  .where(`username`, username)
  .first();
};

const createUser = (username, token) => {
  return knex(`users`)
  .insert({ token, username });
};

const editUser = (username, token) => {
  return knex(`users`)
  .where(`username`, username)
  .update(`token`, token);
};

const deleteUser = (username) => {
  return knex(`users`)
  .where(`username`, username)
  .del();
};

const getClass = () => {
  return knex(`g32`);
};

module.exports = {
  createUser,
  deleteUser,
  editUser,
  getClass,
  getUser,
};
