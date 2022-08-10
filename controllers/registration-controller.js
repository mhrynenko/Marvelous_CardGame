const User = require('../models/user.js');
const crypto = require('crypto');

const register = async (req, res) => {
    let hashPass = createHash(req.body.password,"InFutureWeMustChangeHashing");
    let newUser = new User('users');
    let objForDatabase = {};
    for (const key in req.body) {
        if (key == 'confirmPassword') {
            continue;
        }
        if (key == 'password') {
            objForDatabase[key] = hashPass.passwordHash;
        }
        else {
            objForDatabase[key] = req.body[key];
        }
    }

    let errorMessage = "";
    await newUser.find(`'${objForDatabase.login}'`, 'login').then(result => {
        if (result != false) {
            errorMessage += "This login is ";
        }
    });

    await newUser.find(`'${objForDatabase.email}'`, 'email').then(result => {
        if (result != false) {
            if (errorMessage == ''){
                errorMessage += "This email is ";
            }
            else {
                errorMessage = "These login and email are ";
            }
        }
    });

    if (errorMessage != '') {
        errorMessage += 'already in use'
        res.send(errorMessage);
    }
    else {
        newUser.save(objForDatabase);
        res.send('created');
    }
}

function createHash (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};


module.exports = {
    register
};