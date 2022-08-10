var mysql = require('mysql2');
var confJson = require('./config.json');

const connectDB = () => {
    var connection = mysql.createConnection(confJson);
 
    connection.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });

    return connection;
}

module.exports = {connectDB};
