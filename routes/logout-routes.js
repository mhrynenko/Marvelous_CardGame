const express = require('express');
const router = express.Router();

const { makeLogout } = require('../controllers/logout-controller');

router.get('/logout', makeLogout);
router.post('/logout', makeLogout);

module.exports = router;