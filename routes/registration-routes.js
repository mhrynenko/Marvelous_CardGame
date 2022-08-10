const express = require('express')
const path = require('path');
const { register } = require('../controllers/registration-controller');

const router = express.Router();

router.get('/register', (req, res) => {
    return res.sendFile(path.resolve(__dirname, '../views', 'registration.html'));
})

router.post ('/register', register);

module.exports = router;