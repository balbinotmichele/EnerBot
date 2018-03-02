/*global require,module,console*/
const Markup = require('telegraf/markup');
, {setTimeout} = require('timers')
, mysql = require('mysql')
, findQuestions = () => new Promise((resolve, reject) => {
  const risultati = []
    , connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'dati-bot'
    });
    connection.connect();

    connection.query('SELECT Azienda FROM nomi_aziende', function (error, results, fields) {
      if (error) {

        return reject(error);
      };

      return resolve(results.map(elm => elm.Azienda));
    });

    connection.end();
});

module.exports = Scene => {
  const index = new Scene('FAQ')
    , sceneMenu = findQuestions();
    , sceneKeyboard = Markup
      .keyboard(sceneMenu)
      .resize()
      .extra();

  index.enter(ctx => {
    console.info(`Serving index to ${ctx.session.username}`);
    ctx.reply('Qual è la tua domanda?', sceneKeyboard);
  });

  index.hears('Indietro', async ctx => {
    console.info(`Navigation from index to FAQ`);
    await index.leave();
    await ctx.scene.enter('FAQ');
  });

  sceneMenu.forEach(elm => { //setta l'ingresso in ogni scena
    index.hears(elm, async ctx => {
      console.info(`Navigation from index to ${elm}`);
      ctx.reply(getRisposta(elm[0]), sceneKeyboard);
    });
  });

  function getRisposta(domanda) {
      return "Risposta a "+domanda+" non implementata"
  }
  return index;
};
