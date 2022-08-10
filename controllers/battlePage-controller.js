const path = require('path');

const loadBattlePage = (req, res) => {
    res.cookie("userLogin", req.query.login);
    res.cookie("opponentLogin", req.query.opponentLogin);
    res.sendFile(path.resolve(__dirname, '../views', 'battlePage.html'));
};

module.exports = {
    loadBattlePage
};