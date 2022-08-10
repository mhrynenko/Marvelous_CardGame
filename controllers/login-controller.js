const path = require('path');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const getLoginPage = (req, res) => {
    if (req.cookies.status == undefined) {
        return res.sendFile(path.resolve(__dirname, '../views', 'login.html'));
    }
    else {
        return res.redirect('/mainPage');
    }
};

const makeLogin = async (req, res) => {
    let newUser = new User('users');
    let objFromDatabase = {};
    let errorMessage = "";

    await newUser.find(`'${req.body.login}'`, 'login').then(result => {
        if (result == false) {
            errorMessage = "No such user";
        }
        else {
            for (const key in result) {
                objFromDatabase[key] = result[key];
            }
        }
    });
    
    if (errorMessage != "") {
        return res.json({result:"No such user"});
    }
    if (!isCorrect(req.body.password, objFromDatabase.password, "InFutureWeMustChangeHashing")) {
        return res.json({result:"Wrong password"});
    }
    
    const token = generateAccessToken(objFromDatabase.login, objFromDatabase.status);
    res.cookie('token', token);
    return res.redirect('/mainPage');
};

const generateAccessToken = (login, status) => {
    const payload = { 
        status,
        login
    }

    return jwt.sign(payload, "SECRET_KEY", {expiresIn: '24h'});
};

function createHash (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function isCorrect (enteredPassword, passwordHash, salt) {
    let temp = createHash(enteredPassword, salt);
    if (temp.passwordHash === passwordHash) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = {
    getLoginPage,
    makeLogin
};

