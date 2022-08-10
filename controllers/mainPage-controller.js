const path = require('path');
var jwt = require('jsonwebtoken');

const loadMainPage = (req, res) => {
    const decodedUser = jwt.verify(req.cookies.token, "SECRET_KEY", function (err, decoded) {
        if(err) {
            return -1;
        }
        else { 
            return decoded;
        }
    });
    if (decodedUser == -1) {
        res.redirect('/logout');
    }
    else {
        res.cookie("status", decodedUser.status);
        res.cookie("login", decodedUser.login);
        res.sendFile(path.resolve(__dirname, '../views', 'mainPage.html'));
    }
};

module.exports = {
    loadMainPage
};