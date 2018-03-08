const express = require("express");
const router = express.Router();
const mysql = require('./sqlConnection');
//const User = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkToken = require("../middleware/checkToken");
const CoinMarketCap = require("node-coinmarketcap");
const moment = require("moment");

var coinmarketcap = new CoinMarketCap();





router.get('/', checkToken, (req, res, next) => {
  
    var querySelect = mysql.query("SELECT * FROM ordem WHERE usuarioId=" + req.userData.id+" ORDER BY idOrdem DESC", function (err, result) {
            if (err) {
                throw err;
        }
            console.log(querySelect);

            res.status(200).json({
                message: 'ordem get',
                cotacao: result

            })
        });







});

router.post('/', checkToken, (req, res, next) => {
    var myDate = moment(new Date()).utcOffset(-6).format("YYYY-MM-DD HH:mm:ss");
    var myDate2 = moment(new Date()).utcOffset(-3).format("YYYY-MM-DD HH:mm:ss");
    coinmarketcap.get("bitcoin", coin => {
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
    });


    var querySelect = mysql.query("SELECT * FROM cotacao ORDER BY idCotacao DESC", function (err, result) {
        if (err) {
            throw err;
        }
        var usuario_id = "'" + req.userData.id + "'";
        const ordem = {
            usuarioId: req.userData.id,
            data: myDate,
            qtdbtc: req.body.qtdbtc,
            valorporbtc: result[0].valor,
            tipoCompraVenda: req.body.tipoCompraVenda
        };

        var queryInsert = mysql.query('INSERT INTO ordem SET ?', ordem, function (err, result) {
            console.log(queryInsert.sql);
            if (err) {
                throw err;
            }
            ordem.data = myDate2;
            res.status(201).json({
                message: 'ordem criada',
                ordem: ordem

            });
        });

    });



});



module.exports = router;