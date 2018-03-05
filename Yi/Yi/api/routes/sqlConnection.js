var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    port: '3000',
    database: 'yidt'
});
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('my sql connected');

});

module.exports = connection;
