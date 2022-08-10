const User = require('../models/user.js');
const nodemailer = require("nodemailer");
const prompt = require('prompt-sync')();

const remindPassword = async (req, res) => {
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
        return res.json({
            result : false, 
            message : errorMessage
        });
    }

    let senderEmail = prompt('Enter your e-mail (gmail):');
    let senderPass = prompt('Enter password from e-mail:');

    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user: senderEmail, 
            pass: senderPass, 
        },
    });

    let content = `<div style="width: 350px; background-color: #204829; border-radius: 20px; margin-left: auto;
    margin-right: auto; margin-top: 50px; padding: 20px">
        <span style="font-size: 20px;
        font-family: 'Special Elite', cursive;
        color: white;">Your password from site is: ${objFromDatabase.password}</span>
    </div>`;
    
    let info = await transporter.sendMail({
        from: `"Reminder" <${senderEmail}>`, 
        to: objFromDatabase.email,
        subject: "Your password from site",
        text: "Hello world?", 
        html: content,
    });

    return res.json({
        result : true, 
        message : 'Password was sent to email'
    });
}

module.exports = {
    remindPassword
};