const mysql = require('./sqlConnection');
const CoinMarketCap = require("node-coinmarketcap");
const moment = require("moment");
const CronJob = require('cron').CronJob;

var coinmarketcap = new CoinMarketCap();
//coinmarketcap.get("BTC", coin => {
//   console.log(coin.price_usd); // Prints the price in USD of BTC at the moment.
//});




router.get('/', (req, res, next) => {
    coinmarketcap.get("bitcoin", coin => {
        console.log(coin.price_usd);
        //  var now = moment();
        var myDate = moment(new Date()).utcOffset(-6).format("YYYY-MM-DD HH:mm:ss");
        //var created = new Date();
        // created = now;
        const cotacao = {
            moeda: "btc",
            valor: coin.price_usd,
            data: myDate,
            exchange: "us"
        };

        // const job = new CronJob('*/1 * * * *', () => {
        /*
        var queryInsert = mysql.query('INSERT INTO cotacao SET ? ', cotacao, function (err, result) {
            console.log(queryInsert.sql);
            if (err) {
                throw err;
            }
            });
        }, null, true, 'America/Sao_Paulo');*/

        var querySelect = mysql.query("SELECT * FROM cotacao ORDER BY idCotacao DESC", function (err, result) {
            if (err) {
                throw err;
            }

            res.status(200).json({
                message: 'cotacao get',
                cotacao: result

            })
        });



    });




});
// var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();



module.exports = router;