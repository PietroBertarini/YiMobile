const express = require("express");
const router = express.Router();
const mysql = require('./sqlConnection');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'usuario get'
    })
});

//Log in usuario,O cliente entra com seu email e senha e ele recebe um token para acessar as funcoes privadas da api
router.post('/login', (req, res, next) => {
    if (req.body.email != undefined && req.body.senha != undefined) {//verifica-se o cliente preencheu todos os campos necessarios para o login.
        var querySelect = mysql.query("SELECT * FROM usuario WHERE email= '" + req.body.email + "'", function (err, result) {//em seguida procura o usuario no banco local,para saber se ele ja fez o cadastro no sistema
            if (result[0] == undefined) {
                if (err) {
                    throw err;
                }
                else {
                    res.status(400).json({
                        message: 'usuario nao cadastrado,acesse signIn e faça o cadastro'
                    });
                }
            }
            else {
                bcrypt.compare(req.body.senha, result[0].senha, (err, ress) => {//caso o usuario seja encontrado no sistema,verifica se sua senha está correta
                    if (err) {
                        return ress.status(401).json({
                            message: 'Problem At Login'
                        });
                    }
                    if (ress) {
                        const token = jwt.sign({ id: result[0].idUsuario }, 'senha', { expiresIn: "1h" });
                        return res.status(200).json({
                            message: 'Login Sucess',
                            idUsuario: result[0].idUsuario,
                            tokenLogIn: token

                        });

                    }
                    res.status(401).json({
                        message: 'Senha incorreta'

                    });

                });
          
            }
        });
    } else {
        res.status(400).json({
            message: 'campo vazio ou formato errado(coloque em json)',
        });
    }
});

//SignUp usuario,o cliente entra com um email e senha,caso nao tenha no banco de dados local um usuario cadastrado com este email.Um novo usuario é criado com o respectivo email e senha inseridos.
router.post('/signup', (req, res, next) => {
    if (req.body.email != undefined && req.body.senha != undefined) {//verifica-se o cliente preencheu todos os campos necessarios para o signUp.
        var querySelect = mysql.query("SELECT * FROM usuario WHERE email= '" + req.body.email + "'", function (err, result) {//verifica se o email ja foi cadastrado anteriormente,se sim,nao podera criar um novo cadastro
            if (result[0] == undefined) {
                if (err) {
                    throw err;
                }
                bcrypt.hash(req.body.senha, 10, (err, hash) => {//encripta a senha do usuario para nao salva-la no banco de dados,por uma questao de seguranca para caso alguem tenha acesso direto a esse banco.
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const usuario = {
                            email: req.body.email,
                            senha: hash
                        };

                        var queryInsert = mysql.query('INSERT INTO usuario SET ?', usuario, function (err, result) {//insere o cadastro feito no banco de dados
                         //   console.log(queryInsert.sql);
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
    }else {
        res.status(400).json({
            message: 'campo vazio ou formato errado(coloque em json)',
        });
    } 
});
module.exports = router;