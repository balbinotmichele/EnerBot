const Markup = require('telegraf/markup')
, {setTimeout} = require('timers')
, mysql = require('mysql')
, getTrend = (CodUte) => new Promise((resolve, reject) => {
  const risultati = []
    , connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'EnerbotDb'
    });
    connection.connect();

    connection.query(`SELECT Punteggio, DataOra FROM utente WHERE CodUtente LIKE '${CodUte}' ORDER BY DataOra`, function (error, results, fields) {
      if (error) {
        return reject(error);
      };

      return resolve(results.map(elm => elm.Domanda));
    });

    connection.end();
})
module.exports = Scene => {
    const index = new Scene('Trend personale')
        , sceneMenu = [
            ['Profilo personale'],
            ['Indietro']
        ]
        , sceneKeyboard = Markup
        .keyboard(sceneMenu)
        .resize()
        .extra();

    index.enter(ctx => {
        console.info(`Serving Trend personale to ${ctx.session.username}`);
        let trend = getTrend(ctx.from.id);
        var i=0;
        for (i=0;i<10;i++){
          ctx.reply(`'${trend[i].CodUtente}' con '${trend[i].Punteggio}'`, sceneKeyboard);
        }
    });

    index.hears('Profilo personale', async ctx => {
        console.info(`Navigation from Trend personale to Profilo personale`);
        await index.leave();
        await ctx.scene.enter('Profilo personale');
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from Trend personale to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });

  return index;
};
