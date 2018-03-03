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

    connection.query(`SELECT DataOra ,Punteggio FROM utente WHERE CodUtente LIKE '${CodUte}' ORDER BY DataOra`, function (error, results, fields) {
      if (error) {
        return reject(error);
      };

      return resolve(results.map(elm => ({
        'DataOra': elm.DataOra,
        'Punteggio': elm.Punteggio
    })));
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

    index.enter(async ctx => {
        console.info(`Serving Trend personale to ${ctx.session.username}`);
        let trend = await getTrend(10033);
        console.log(trend)
        //let trend = getTrend(ctx.from.id); da utilizzare in un utilizzo reale con dati reali
        var i=0;
        trend.forEach(elm => {
          ctx.reply(`Il '${elm.DataOra}' avevi '${elm.Punteggio}' `,sceneKeyboard);
        })
    });

    index.hears('Profilo personale', async ctx => {
        console.info(`Navigation from Trend personale to Profilo personale`);
        ctx.reply('Ancora da implementare');
        //await index.leave();
        //await ctx.scene.enter('Profilo personale');
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from Trend personale to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });

  return index;
};
