const express = require("express");
const router = express.Router();
const mysql = require('./sqlConnection');
const User = require("../models/usuarioModel");
const bcrypt = require("bcrypt");



router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'usuario get'
    })
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