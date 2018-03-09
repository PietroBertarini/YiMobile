const express = require("express");
const router = express.Router();
const checkToken = require("../middleware/checkToken");
const ordemController = require('../controllers/ordemController');

//get ordem,apos o cliente informar o token de login no header do pedidoGet,o cliente ira receber todas as ordens relacionadas ao seu Id.
router.get('/', checkToken,ordemController.getOrdem);

//post ordem,apos o cliente informar o token de login no header do pedidoPost,cria-se uma ordem relacionada ao id do token com as informacoes passados pelo json(qtdbtc e se é do tipo compra e venda )
router.post('/', checkToken, ordemController.postOrdem);



module.exports = router;