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

```bash
$ npm install jsonwebtoken
```

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
{IMAGEM DO PRINT}

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









The standard for JWT defines an `exp` claim for expiration. The expiration is represented as a **NumericDate**:

> A JSON numeric value representing the number of seconds from 1970-01-01T00:00:00Z UTC until the specified UTC date/time, ignoring leap seconds.  This is equivalent to the IEEE Std 1003.1, 2013 Edition [POSIX.1] definition "Seconds Since the Epoch", in which each day is accounted for by exactly 86400 seconds, other than that non-integer values can be represented.  See RFC 3339 [RFC3339] for details regarding date/times in general and UTC in particular.

This means that the `exp` field should contain the number of seconds since the epoch.

Signing a token with 1 hour of expiration:

```javascript
jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');
```

Another way to generate a token like this with this library is:

```javascript
jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: 60 * 60 });

//or even better:

jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: '1h' });
```

### jwt.verify(token, secretOrPublicKey, [options, callback])

(Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.

(Synchronous) If a callback is not supplied, function acts synchronously. Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.

`token` is the JsonWebToken string

`secretOrPublicKey` is a string or buffer containing either the secret for HMAC algorithms, or the PEM
encoded public key for RSA and ECDSA.

As mentioned in [this comment](https://github.com/auth0/node-jsonwebtoken/issues/208#issuecomment-231861138), there are other libraries that expect base64 encoded secrets (random bytes encoded using base64), if that is your case you can pass `Buffer.from(secret, 'base64')`, by doing this the secret will be decoded using base64 and the token verification will use the original random bytes.

`options`

* `algorithms`: List of strings with the names of the allowed algorithms. For instance, `["HS256", "HS384"]`.
* `audience`: if you want to check audience (`aud`), provide a value here. The audience can be checked against a string, a regular expression or a list of strings and/or regular expressions. Eg: `"urn:foo"`, `/urn:f[o]{2}/`, `[/urn:f[o]{2}/, "urn:bar"]`
* `issuer` (optional): string or array of strings of valid values for the `iss` field.
* `ignoreExpiration`: if `true` do not validate the expiration of the token.
* `ignoreNotBefore`...
* `subject`: if you want to check subject (`sub`), provide a value here
* `clockTolerance`: number of seconds to tolerate when checking the `nbf` and `exp` claims, to deal with small clock differences among different servers
* `maxAge`: the maximum allowed age for tokens to still be valid. It is expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms). Eg: `1000`, `"2 days"`, `"10h"`, `"7d"`.
* `clockTimestamp`: the time in seconds that should be used as the current time for all necessary comparisons.


```js
// verify a token symmetric - synchronous
var decoded = jwt.verify(token, 'shhhhh');
console.log(decoded.foo) // bar

// verify a token symmetric
jwt.verify(token, 'shhhhh', function(err, decoded) {
  console.log(decoded.foo) // bar
});

// invalid token - synchronous
try {
  var decoded = jwt.verify(token, 'wrong-secret');
} catch(err) {
  // err
}

// invalid token
jwt.verify(token, 'wrong-secret', function(err, decoded) {
  // err
  // decoded undefined
});

// verify a token asymmetric
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, function(err, decoded) {
  console.log(decoded.foo) // bar
});

// verify audience
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo' }, function(err, decoded) {
  // if audience mismatch, err == invalid audience
});

// verify issuer
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer' }, function(err, decoded) {
  // if issuer mismatch, err == invalid issuer
});

// verify jwt id
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid' }, function(err, decoded) {
  // if jwt id mismatch, err == invalid jwt id
});

// verify subject
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid', subject: 'subject' }, function(err, decoded) {
  // if subject mismatch, err == invalid subject
});

// alg mismatch
var cert = fs.readFileSync('public.pem'); // get public key
jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
  // if token alg != RS256,  err == invalid signature
});

```

### jwt.decode(token [, options])

(Synchronous) Returns the decoded payload without verifying if the signature is valid.

__Warning:__ This will __not__ verify whether the signature is valid. You should __not__ use this for untrusted messages. You most likely want to use `jwt.verify` instead.

`token` is the JsonWebToken string

`options`:

* `json`: force JSON.parse on the payload even if the header doesn't contain `"typ":"JWT"`.
* `complete`: return an object with the decoded payload and header.

Example

```js
// get the decoded payload ignoring signature, no secretOrPrivateKey needed
var decoded = jwt.decode(token);

// get the decoded payload and header
var decoded = jwt.decode(token, {complete: true});
console.log(decoded.header);
console.log(decoded.payload)
```

## Errors & Codes
Possible thrown errors during verification.
Error is the first argument of the verification callback.

### TokenExpiredError

Thrown error if the token is expired.

Error object:

* name: 'TokenExpiredError'
* message: 'jwt expired'
* expiredAt: [ExpDate]

```js
jwt.verify(token, 'shhhhh', function(err, decoded) {
  if (err) {
    /*
      err = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: 1408621000
      }
    */
  }
});
```

### JsonWebTokenError
Error object:

* name: 'JsonWebTokenError'
* message:
  * 'jwt malformed'
  * 'jwt signature is required'
  * 'invalid signature'
  * 'jwt audience invalid. expected: [OPTIONS AUDIENCE]'
  * 'jwt issuer invalid. expected: [OPTIONS ISSUER]'
  * 'jwt id invalid. expected: [OPTIONS JWT ID]'
  * 'jwt subject invalid. expected: [OPTIONS SUBJECT]'

```js
jwt.verify(token, 'shhhhh', function(err, decoded) {
  if (err) {
    /*
      err = {
        name: 'JsonWebTokenError',
        message: 'jwt malformed'
      }
    */
  }
});
```

## Algorithms supported

Array of supported algorithms. The following algorithms are currently supported.

alg Parameter Value | Digital Signature or MAC Algorithm
----------------|----------------------------
HS256 | HMAC using SHA-256 hash algorithm
HS384 | HMAC using SHA-384 hash algorithm
HS512 | HMAC using SHA-512 hash algorithm
RS256 | RSASSA using SHA-256 hash algorithm
RS384 | RSASSA using SHA-384 hash algorithm
RS512 | RSASSA using SHA-512 hash algorithm
ES256 | ECDSA using P-256 curve and SHA-256 hash algorithm
ES384 | ECDSA using P-384 curve and SHA-384 hash algorithm
ES512 | ECDSA using P-521 curve and SHA-512 hash algorithm
none | No digital signature or MAC value included

## Refreshing JWTs

First of all, we recommend to think carefully if auto-refreshing a JWT will not introduce any vulnerability in your system.

We are not comfortable including this as part of the library, however, you can take a look to [this example](https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48) to show how this could be accomplished.
Apart from that example there are [an issue](https://github.com/auth0/node-jsonwebtoken/issues/122) and [a pull request](https://github.com/auth0/node-jsonwebtoken/pull/172) to get more knowledge about this topic.

# TODO

* X.509 certificate chain is not checked

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
