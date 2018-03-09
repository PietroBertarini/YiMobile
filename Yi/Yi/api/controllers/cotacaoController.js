const mysql = require('../../sqlConnection');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CoinMarketCap = require("node-coinmarketcap");
const moment = require("moment");
const CronJob = require('cron').CronJob;
var coinmarketcap = new CoinMarketCap();


// get Cotacao,retorna todas as cotacoes salvas no banco de dados local.
exports.getCotacao=(req, res, next) => {
    coinmarketcap.get("bitcoin", coin => {//atualiza o banco de dados,inserindo uma nova cotacao com a hora atual do servidor.
        console.log(coin.price_usd);

        var dataAtual = moment(new Date()).utcOffset(-6).format("YYYY-MM-DD HH:mm:ss");
        const cotacao = {
            moeda: "btc",
            valor: coin.price_usd,
            data: dataAtual,
            exchange: "us"
        };



        var queryInsert = mysql.query('INSERT INTO cotacao SET ? ', cotacao, function (err, result) {//insere a cotacao atual
            console.log(queryInsert.sql);
            if (err) {
                throw err;
            }
        });


        var querySelect = mysql.query("SELECT * FROM cotacao ORDER BY idCotacao DESC", function (err, result) {//retorna as cotacoes do banco de dados
            if (err) {
                throw err;
            }

            res.status(200).json({
                message: 'cotacao get',
                cotacao: result

            })
        });



    });




}