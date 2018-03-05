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
               
            var query = mysql.query('INSERT INTO usuario SET ?', usuario, function (err, result) {
               console.log(query.sql);
              if (err) {
                 throw err;
            }
         });
         }
          res.status(201).json({
             message: 'user created',
         //   novoUsuario: usuario

                });


    });
});
module.exports = router;