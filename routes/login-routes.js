const express = require('express');
const { getLoginPage, makeLogin } = require('../controllers/login-controller');

const router = express.Router();

router.get('/login', getLoginPage);
router.post ('/login', makeLogin);

module.exports = router;