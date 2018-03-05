const express = require("express");
const router = express.Router();
const mysql = require('./sqlConnection');



router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'teste get'
    })
});
router.post('/', (req, res, next) => {
    const usuario = {
        email: req.body.email,
        senha: req.body.senha
    };
    var query = mysql.query('INSERT INTO usuario SET ?', usuario, function (err, result) {
        console.log(query.sql);
        if (err) {
            throw err;
        }
    });
    res.status(201).json({
        message: 'teste get',
        novoUsuario: usuario
        }); 
    });
module.exports = router;