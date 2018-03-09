const express = require("express");
const router = express.Router();
const mysql = require('./sqlConnection');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkToken = require("../middleware/checkToken");
const CoinMarketCap = require("node-coinmarketcap");
const moment = require("moment");
var coinmarketcap = new CoinMarketCap();

//get orgdns,apos o cliente informar o token de login no header do pedidoGet,o cliente ira receber todas as ordens relacionadas ao seu Id.
router.get('/', checkToken, (req, res, next) => {
    var querySelect = mysql.query("SELECT * FROM ordem WHERE usuarioId=" + req.userData.id+" ORDER BY idOrdem DESC", function (err, result) {
            if (err) {
                throw err;
        }
            //console.log(querySelect);
            res.status(200).json({
                Ordens: result

            })
        });



});
//post ordens,apos o cliente informar o token de login no header do pedidoPost,cria-se uma ordem relacionada ao id do token com as informacoes passados pelo json(qtdbtc e se é do tipo compra e venda )
router.post('/', checkToken, (req, res, next) => {
    if (req.body.qtdbtc != undefined && req.body.tipoCompraVenda != undefined) {
        var dataAtual = moment(new Date()).utcOffset(-6).format("YYYY-MM-DD HH:mm:ss");
        var dataAtual2 = moment(new Date()).utcOffset(-3).format("YYYY-MM-DD HH:mm:ss");
        coinmarketcap.get("BTC", coin => {//adiciona no banco de dados a cotacao atual da moeda btc
            const cotacao = {
                moeda: "btc",
                valor: coin.price_usd,
                data: dataAtual,
                exchange: "us"
            };
            var queryInsert = mysql.query('INSERT INTO cotacao SET ? ', cotacao, function (err, result) {//insere a cotacao atual no banco de dados
                //console.log(queryInsert.sql);
                if (err) {
                    throw err;
                }
            });
        });

        var querySelect = mysql.query("SELECT * FROM cotacao ORDER BY idCotacao DESC", function (err, result) {//seleciona a ultima cotacao para criar a ordem  com a sua cotacao atualizada
            if (err) {
                throw err;
            }
            var usuario_id = "'" + req.userData.id + "'";
            const ordem = {
                usuarioId: req.userData.id,
                data: dataAtual,
                qtdbtc: req.body.qtdbtc,
                valorporbtc: result[0].valor,
                tipoCompraVenda: req.body.tipoCompraVenda
            };

            var queryInsert = mysql.query('INSERT INTO ordem SET ?', ordem, function (err, result) {//insere a ordem no banco de dados
                console.log(queryInsert.sql);
                if (err) {
                    throw err;
                }
                ordem.data = dataAtual2;
                res.status(201).json({
                    message: 'ordem criada',
                    ordem: ordem

                });
            });

        });
    } else {
        res.status(400).json({
            message: 'campo vazio ou formato errado(coloque em json)',
        });
    }


});



module.exports = router;