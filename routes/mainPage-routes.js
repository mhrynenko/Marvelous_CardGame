const express = require('express')
const router = express.Router();

const { loadMainPage } = require('../controllers/mainPage-controller');

router.get('/mainPage', loadMainPage);

module.exports = router;