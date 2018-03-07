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
    var idLogIn = req.userData.id;
    res.status(200).json({
        message: 'ordem get',
        id: req.userData.id
    })
});


router.post('/', checkToken, (req, res, next) => {
    var myDate = moment(new Date()).utcOffset(-3).format("YYYY-MM-DD HH:mm:ss");
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
            res.status(201).json({
                message: 'ordem criada',
                ordem: ordem

            });
        });

    });



});









/*
router.post('/login', (req, res, next) => {
    if (req.body.email != undefined && req.body.senha != undefined) {
        var querySelect = mysql.query("SELECT * FROM usuario WHERE email= '" + req.body.email + "'", function (err, result) {
            if (result[0] == undefined) {
                if (err) {
                    throw err;
                }
                else {
                    res.status(400).json({
                        message: 'usuario nao existente'
                    });
                }
            }
            else {
                bcrypt.compare(req.body.senha, result[0].senha, (err, ress) => {
                    if (err) {
                        return ress.status(401).json({
                            message: 'Problem At Login'
                        });
                    }
                    if (ress) {
                        const token = jwt.sign({
                            email: result[0].idUsuario

                        }, 'senha',
                            {
                                expiresIn: "1h"
                            })
                        return res.status(200).json({
                            message: 'Login Sucess',
                            tokenLogIn: token
                        });

                    }
                    res.status(401).json({
                        message: 'Senha incorreta'

                    });

                });
                //  res.status(400).json({
                //     message: 'usuario existente'
                // });

            }
        });
    } else {
        res.status(400).json({
            message: 'campo vazio',
        });
    }
});


router.post('/signup', (req, res, next) => {
    if (req.body.email != undefined && req.body.senha != undefined) {
        var querySelect = mysql.query("SELECT * FROM usuario WHERE email= '" + req.body.email + "'", function (err, result) {
            if (result[0] == undefined) {
                if (err) {
                    throw err;
                }
                bcrypt.hash(req.body.senha, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const usuario = {
                            email: req.body.email,
                            senha: hash
                        };

                        var queryInsert = mysql.query('INSERT INTO usuario SET ?', usuario, function (err, result) {
                            console.log(queryInsert.sql);
                            if (err) {
                                throw err;
                            }
                        });
                        res.status(201).json({
                            message: 'user created',

                        });

                    }
                });
            }
            else {
                res.status(400).json({
                    message: 'usuario ja existente'
                });

            }
        });
    } else {
        res.status(400).json({
            message: 'campo vazio',
        });
    }
});
*/
module.exports = router;