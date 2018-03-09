const express = require("express");
const router = express.Router();



const usuarioController = require('../controllers/usuarioController');

//Log in usuario,O cliente entra com seu email e senha e ele recebe um token para acessar as funcoes privadas da api
router.post('/login', usuarioController.LogInUsuario);

//SignUp usuario,o cliente entra com um email e senha,caso nao tenha no banco de dados local um usuario cadastrado com este email.Um novo usuario é criado com o respectivo email e senha inseridos.
router.post('/signup', usuarioController.SignUpUsuario);
module.exports = router;