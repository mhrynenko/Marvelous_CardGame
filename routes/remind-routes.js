const express = require('express')
const path = require('path');
const { remindPassword } = require('../controllers/remind-controller');

const router = express.Router();

router.get('/remind', (req, res) => {
    return res.sendFile(path.resolve(__dirname, '../views', 'reminder.html'));
});

router.post ('/remind', remindPassword);

module.exports = router;