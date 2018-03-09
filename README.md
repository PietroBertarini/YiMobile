# TESTE YI MOBILE

Teste de Desenvolvimento

Nesse teste iremos construir uma API simples, utilizando pacotes de terceiros que será utilizada
para um aplicativo Mobile e Web com dados em JSON.
A API deve ser implementada usando REST. A API deve permitir que o cliente se
cadastre e realize login publicamente, ou seja, essas funções deve ser possível acessar
essas funções sem autenticação prévia. Outra função pública será a de ver a cotação
atual da moeda BTC, utilizando algum módulo do npm para tal e utilizando a exchange
de sua preferência, retornando a cotação atual e cotação em datas passadas separadas a
cada minuto, salvando as datas no banco sempre em background utilizando cron. Como
função privada, o cliente deve poder buscar as ordens cadastradas para o usuário logado e
cadastrar uma ordem para o usuário logado. Essas ordens não precisam vir do exchange,
podem ser ordens criadas em nosso banco local somente. Pode utilizar o método de
autenticação que preferir e utilize o MySQL como banco de dados.

# Install
Primeiramente abra o banco de dados local(que utilize MySQL) e crie as seguintes tabelas

```js
DROP TABLE IF EXISTS `cotacao`;
CREATE TABLE `cotacao` (
  `idCotacao` int(11) NOT NULL AUTO_INCREMENT,
  `moeda` varchar(45) NOT NULL,
  `valor` int(11) NOT NULL,
  `data` datetime DEFAULT NULL,
  `exchange` varchar(45) NOT NULL,
  PRIMARY KEY (`idCotacao`),
  UNIQUE KEY `idCotacao_UNIQUE` (`idCotacao`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8;

```

```js

DROP TABLE IF EXISTS `ordem`;
CREATE TABLE `ordem` (
  `idOrdem` int(11) NOT NULL AUTO_INCREMENT,
  `usuarioId` int(11) DEFAULT NULL,
  `data` datetime DEFAULT NULL,
  `qtdbtc` int(11) DEFAULT NULL,
  `valorporbtc` int(11) DEFAULT NULL,
  `tipoCompraVenda` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idOrdem`),
  UNIQUE KEY `idOrdem_UNIQUE` (`idOrdem`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;


```

```js

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `senha` varchar(255) NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

```
Essas tabelas que serao utilizadas para a realização do trabalho.Em seguida acesse o arquivo sqlConnection.js e complete as informações de acordo com o seu banco de dados local.
Exemplo:
```js
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost', //modifique aqui
    user: 'root', //modifique aqui
    password: 'senha', //modifique aqui
    port: '3000', //modifique aqui
    database: 'yidt' //modifique aqui
});
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('my sql connected');

});
module.exports = connection;
```
Em seguida,modifique em qual porta vc ira testar a API no arquivo server.js .

```js
'use strict';
var http = require('http');
var port = process.env.PORT || 3000;//modifique aqui

const app = require('./app');
const server = http.createServer(app);


server.listen(port);
```
Em seguida acesse a pasta YI e depois a Yi novamente(sim,2x kkk) ate acessar a pasta onde se encontra o server.js em seguide rode o comando 
```bash
+$ node server.js
```
Em seguida aba o Postmen(ou outro software para testar api rest) e entre em localhost:XXXXX(O XXXXX será substituido pela porta que voce colocou em server.js) e em seguida acesses as rotas definidas abaixo.
# Uso

### {post}localhost:XXXXX/usuario/signup
Rota em que o cliente realiza o cadastro na api,seus dados irão ser salvos no banco de dados local.
Dados que irao ser necessarios para o signUp:
`email` email em que o cliente ira se cadastrar,após cadastrado,esse email não pode ser utilizado novamente para cadastro.
`senha` senha do cliente que será criptografada no banco de dados local para segurança do cliente.

Examplo de json para realizar um cadastro.

```js
{
"email":"exemplo@exemple.com",
"senha":"senhaSecreta"
}
```
caso de certo,uma mensagem sera enviada.
```js
{
    "message": "user created"
}
```
caso de errado,uma mensagem sera enviada para mostrar o erro.
```js
{
    "message": "usuario ja existente"
}
```
### {post}localhost:XXXXX/usuario/login

Rota em que o cliente realiza o logIn na api,um token sera criado para o acesso as funções privadas da api.
Dados que irao ser necessarios para o logIn:
`email` email do cliente.
`senha` senha do cliente que foi cadastrada.

Examplo de json para realizar logIn.

```js
{
"email":"exemplo@exemple.com",
"senha":"senhaSecreta"
}
```
Caso de certo uma mensagem sera enviada

```js
{
    "message": "Login Sucess",
    "idUsuario": 22,
    "tokenLogIn": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsImlhdCI6MTUyMDYyMjg4NiwiZXhwIjoxNTIwNjI2NDg2fQ.dr0IcDB-8gdLp14qPRcD-AoBMC8L97-ojojgq9ipWhk"
}
```
caso de errado,uma mensagem sera enviada:
{
    "message": "Senha incorreta"
}

### {get}localhost:XXXXX/cotacao

Rota em que o cliente podera ver as cotacoes passadas que foram salvas no banco de dados local

Examplo da saida ao acessar esta rota
```js
    "cotacao": [
        {
            "idCotacao": 117,
            "moeda": "btc",
            "valor": 8896,
            "data": "2018-03-09T16:18:32.000Z",
            "exchange": "us"
        },
        {
            "idCotacao": 116,
            "moeda": "btc",
            "valor": 8990,
            "data": "2018-03-09T15:44:28.000Z",
            "exchange": "us"
        }
              ]
    
```

### {get}localhost:XXXXX/ordem
Rota em que o cliente podera ver as ordem relacionadas ao seu Id.Por ser uma ordem privada,é necessário que o token de LogIn(obtido ao realizar o logIn na api) seja colocado no header do json.Utilizando a key Authorization.
![authorization](https://user-images.githubusercontent.com/17735088/37228572-de81104a-23bf-11e8-8476-da5a2bf00071.png)


Examplo da saida ao acessar esta rota
```js
    {
    "Ordens": [
        {
            "idOrdem": 26,
            "usuarioId": 20,
            "data": "2018-03-09T15:44:21.000Z",
            "qtdbtc": 11,
            "valorporbtc": 8968,
            "tipoCompraVenda": "compra"
        },
        {
            "idOrdem": 25,
            "usuarioId": 20,
            "data": "2018-03-09T15:41:21.000Z",
            "qtdbtc": 11,
            "valorporbtc": 8968,
            "tipoCompraVenda": "compra"
        },
    
```
Caso o cliente esqueça o token ou insira um token invalido,uma mensagem de erro sera mostrada
```js
   {
    "message": "Problem at login token,please login again e try again with a new token"
    }
    
```

### {post}localhost:XXXXX/ordem
Rota em que o cliente podera criar uma ordem relacionada ao seu Id.Por ser uma função privada,será necessário um token de LogIn(obtido ao realizar o logIn na api) seja colocado no header do json.Utilizando a key Authorization.


Exemplo de body do json para ordem
```js
   {
	"qtdbtc": "23",
	"tipoCompraVenda": "compra"
	
}
```
Os valores de valorporbtc,data,usuarioId sao automaticamente preenchidos pelo sistema.Utilizando o horario atual e a cotação atual.
Exemplo de saida ao completar a criação da ordem:
```js
  {
    "message": "ordem criada",
    "ordem": {
        "usuarioId": 20,
        "data": "2018-03-09 15:44:21",
        "qtdbtc": "11",
        "valorporbtc": 8968,
        "tipoCompraVenda": "compra"
    }
}
```

Qualquer dúvida,envie para **pietrobcmota@gmail.com** .
## Author

Pietro Bertarini

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
