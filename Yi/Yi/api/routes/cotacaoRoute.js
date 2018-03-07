const express = require("express");
const router = express.Router();
const mysql = require('./sqlConnection');
//const Cotacao = require("../models/cotacaoModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CoinMarketCap = require("node-coinmarketcap");
const moment = require("moment");

var coinmarketcap = new CoinMarketCap();
//coinmarketcap.get("BTC", coin => {
 //   console.log(coin.price_usd); // Prints the price in USD of BTC at the moment.
//});





router.get('/verCotacao', (req, res, next) => {
   // var price;
    //if (req.body.email != undefined && req.body.senha != undefined) {
        var querySelect = mysql.query("SELECT * FROM cotacao", function (err, result) {
            if (result[0] == undefined) {
                if (err) {
                    throw err;
                }
                coinmarketcap.get("bitcoin", coin => {
                    console.log(coin.price_usd);
                    //price = coin.price_usd;
                    

                });
                //coinmarketcap.get("BTC", coin => {
                 //   console.log(coin.price_usd); // Prints the price in USD of BTC at the moment.
                  
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const cotacao = {
                            moeda: "btc",
                            valor: coin.price_usd,
                            data: Date.now(),
                            exchange: "us"
                        };

                        var queryInsert = mysql.query('INSERT INTO cotacao SET ?', cotacao, function (err, result) {
                            console.log(queryInsert.sql);
                            if (err) {
                                throw err;
                            }
                        });
                        res.status(201).json({
                            message: 'cotacao created',

                        });

                    }
                //});
            }
          
        });
    
     
    //  res.status(200).json({
     //   message: 'cotacao get'
    //})
});
router.get('/', (req, res, next) => {
    coinmarketcap.get("bitcoin", coin => {
        console.log(coin.price_usd);
      //  var now = moment();
       var  myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        //var created = new Date();
       // created = now;
        const cotacao = {
            moeda: "btc",
            valor: coin.price_usd,
            data: myDate,
            exchange: "us"
        };
        var queryInsert = mysql.query('INSERT INTO cotacao SET ?', cotacao, function (err, result) {
            console.log(queryInsert.sql);
            if (err) {
                throw err;
            }
        });
    
        res.status(200).json({
            message: 'cotacao get',
            cotacao: cotacao
        })


    });
    // var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
   
   
});

module.exports = router;