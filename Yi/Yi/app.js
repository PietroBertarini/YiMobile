const express = require("express");
const CoinMarketCap = require("node-coinmarketcap");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const expressSessions = require("express-session");
const moment = require("moment");
const CronJob = require('cron').CronJob;
const mysql = require('./api/routes/sqlConnection');
var coinmarketcap = new CoinMarketCap();


const usuarioRoutes = require("./api/routes/usuarioRoute");
const cotacaoRoutes = require("./api/routes/cotacaoRoute");
const ordemRoutes = require("./api/routes/ordemRoute");


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use("/usuario", usuarioRoutes);
app.use("/cotacao", cotacaoRoutes);
app.use("/ordem", ordemRoutes);
app.use(expressSessions({ secret: 'max', saveUninitialized: false, resave: false }));
app.use(expressValidator());


coinmarketcap.get("bitcoin", coin => {
    var myDate = moment(new Date()).utcOffset(-3).format("YYYY-MM-DD HH:mm:ss");
    const cotacao = {
        moeda: "btc",
        valor: coin.price_usd,
        data: myDate,
        exchange: "us"
    };

    const job = new CronJob('*/1 * * * *', () => {

        var queryInsert = mysql.query('INSERT INTO cotacao SET ? ', cotacao, function (err, result) {
            console.log(queryInsert.sql);
            if (err) {
                throw err;
            }
        });
    }, null, true, 'America/Sao_Paulo');


});

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;