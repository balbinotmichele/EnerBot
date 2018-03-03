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

    connection.query('SELECT CodDomanda, Domanda FROM faq WHERE Gruppo LIKE 1', function (error, results, fields) {
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
    let query = `SELECT Risposta FROM faq WHERE CodDomanda = ${coddom}`
    console.info(query);
    connection.query(query, function (error, results, fields) {
      if (error) {
        return reject(error);
      };
      debugger
      return resolve(results[0].Risposta);
    });

    connection.end();
});

module.exports = async (Scene) => {
  const index = new Scene('Certificazione energetica')
    , sceneMenu = await findQuestions()
    , sceneKeyboard = Markup
    .keyboard([...sceneMenu, 'Indietro'])
    .resize()
      .extra();

  index.enter(ctx => {
    console.info(`Serving Certificazione energetica to ${ctx.session.username}`);
    ctx.reply('Qual è la tua domanda?', sceneKeyboard);
  });

  index.hears('Indietro', async ctx => {
    console.info(`Navigation from Certificazione energetica to FAQ`);
    await index.leave();
    await ctx.scene.enter('FAQ');
  });

  sceneMenu.forEach(elm => { //setta l'ingresso in ogni scena
    index.hears(elm, async ctx => {
      console.info(`Navigation from Certificazione energetica to ${elm}`);
      debugger
      let risp = await getAnswer(elm[0]);
      console.log(risp);
      ctx.reply(risp, sceneKeyboard);
    });
  });

  return index;
};
