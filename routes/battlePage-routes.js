const express = require('express')
const router = express.Router();

const { loadBattlePage } = require('../controllers/battlePage-controller');

router.get('/battlePage', loadBattlePage);

module.exports = router;