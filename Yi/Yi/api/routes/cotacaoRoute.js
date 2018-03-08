const express = require("express");
const router = express.Router();
const mysql = require('./sqlConnection');
//const Cotacao = require("../models/cotacaoModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CoinMarketCap = require("node-coinmarketcap");
const moment = require("moment");

const CronJob = require('cron').CronJob;

var coinmarketcap = new CoinMarketCap();


router.get('/', (req, res, next) => {
    coinmarketcap.get("bitcoin", coin => {
        console.log(coin.price_usd);
  
        var myDate = moment(new Date()).utcOffset(-6).format("YYYY-MM-DD HH:mm:ss");
        const cotacao = {
            moeda: "btc",
            valor: coin.price_usd,
            data: myDate,
            exchange: "us"
        };
        
        
        
        var queryInsert = mysql.query('INSERT INTO cotacao SET ? ', cotacao, function (err, result) {
            console.log(queryInsert.sql);
            if (err) {
                throw err;
            }
            });
     
       
        var querySelect = mysql.query("SELECT * FROM cotacao ORDER BY idCotacao DESC", function (err, result) {
                if (err) {
                    throw err;
                }

                res.status(200).json({
                    message: 'cotacao get',
                    cotacao: result

                })
            });
        


    });




});
   
   

module.exports = router;