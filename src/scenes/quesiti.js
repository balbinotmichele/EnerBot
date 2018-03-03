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

    connection.query('SELECT Domanda FROM faq WHERE Gruppo LIKE 2', function (error, results, fields) {
      if (error) {

        return reject(error);
      };

      return resolve(results.map(elm => elm.Domanda));
    });

    connection.end();
});
, getAnswer = (dom) => new Promise((resolve, reject) => {
  const risultati = []
    , connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'EnerbotDb'
    });
    connection.connect();

    connection.query(`SELECT Risposta FROM faq WHERE Domanda LIKE '${dom}'`, function (error, results, fields) {
      if (error) {
        return reject(error);
      };

      return resolve(results.map(elm => elm.Risposta));
    });

    connection.end();
});

module.exports = async Scene => {
  const index = new Scene('Quesiti tecnico-procedurali')
    , sceneMenu = await findQuestions()
    , sceneKeyboard = Markup
      .keyboard(sceneMenu)
      .resize()
      .extra();

  index.enter(ctx => {
    console.info(`Serving Quesiti tecnico-procedurali to ${ctx.session.username}`);
    ctx.reply('Qual è la tua domanda?', sceneKeyboard);
  });

  index.hears('Indietro', async ctx => {
    console.info(`Navigation from Quesiti tecnico-procedurali to FAQ`);
    await index.leave();
    await ctx.scene.enter('FAQ');
  });

  sceneMenu.forEach(elm => { //setta l'ingresso in ogni scena
    index.hears(elm, async ctx => {
      console.info(`Navigation from Quesiti tecnico-procedurali to ${elm}`);
      ctx.reply(getAnswer(elm[0]), sceneKeyboard);
    });
  });

  function getRisposta(domanda) {
      return "Risposta a "+domanda+" non implementata"
  }
  return index;
};
