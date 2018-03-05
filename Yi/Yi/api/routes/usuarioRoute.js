const express = require("express");
const router = express.Router();
const mysql = require('./sqlConnection');
const User = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");



router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'usuario get'
    })
});
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
                bcrypt.compare(req.body.senha, result[0].senha,(err, ress)=>{
            if (err) {
                return ress.status(401).json({
                    message: 'Problem At Login' 
                });
            }
            if (ress) {
               // const token=jwt.sign({
                //    email: result[0].email,
                 //   senha: result[0].senha

 //               }, secret,
//                {
 //                   expiresIn: "1h"
  //              })
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
    }else {
        res.status(400).json({
            message: 'campo vazio',
        });
    } 
});
module.exports = router;