const express = require("express");
const router = express.Router();
const cotacaoController = require('../controllers/cotacaoController');

// get Cotacao,retorna todas as cotacoes salvas no banco de dados local.
router.get('/', cotacaoController.getCotacao);
   
   

module.exports = router;