const users = require('express').Router();
const { getUserInfo } = require('../controllers/users');

users.get('/me', getUserInfo);

module.exports = users;
