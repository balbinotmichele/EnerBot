/*global require,module,console*/
const Markup = require('telegraf/markup')
, {setTimeout} = require('timers')
, mysql = require('mysql')
, findQuestions = () => new Promise((resolve, reject) => {
  const risultati = []
    , connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'EnerbotDb'
    });
    connection.connect();

<<<<<<< HEAD
    connection.query('SELECT Domanda FROM faq WHERE Gruppo LIKE 3', function (error, results, fields) {
=======
    connection.query('SELECT CodDomanda, Domanda FROM FAQ WHERE Gruppo LIKE 3', function (error, results, fields) {
>>>>>>> de34f80b872b138c579f4c8faef4308d06e5dc6b
      if (error) {
        return reject(error);
      };

      return resolve(results.map(elm => (elm.CodDomanda + '. ' + elm.Domanda).toString()));
    });

    connection.end();
})
, getAnswer = (coddom) => new Promise((resolve, reject) => {
  const risultati = []
    , connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'EnerbotDb'
    });
    connection.connect();
<<<<<<< HEAD

    connection.query(`SELECT Risposta FROM faq WHERE Domanda LIKE '${dom}'`, function (error, results, fields) {
=======
    let query = `SELECT Risposta FROM FAQ WHERE CodDomanda = ${coddom}`
    console.info(query);
    connection.query(query, function (error, results, fields) {
>>>>>>> de34f80b872b138c579f4c8faef4308d06e5dc6b
      if (error) {
        return reject(error);
      };
      debugger
      return resolve(results[0].Risposta);
    });

    connection.end();
});

module.exports = async Scene => {
  const index = new Scene('Soggetti certificatori')
    , sceneMenu = await findQuestions()
    , sceneKeyboard = Markup
    .keyboard([...sceneMenu, 'Indietro'])
    .resize()
      .extra();

  index.enter(ctx => {
    console.info(`Serving Soggetti certificatori to ${ctx.session.username}`);
    ctx.reply('Qual è la tua domanda?', sceneKeyboard);
  });

  index.hears('Indietro', async ctx => {
    console.info(`Navigation from Soggetti certificatori to FAQ`);
    await index.leave();
    await ctx.scene.enter('FAQ');
  });

  sceneMenu.forEach(elm => { //setta l'ingresso in ogni scena
    index.hears(elm, async ctx => {
      console.info(`Navigation from Soggetti certificatori to ${elm}`);
      ctx.reply(await getAnswer(elm[0]), sceneKeyboard);
    });
  });

  return index;
};
