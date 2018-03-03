const Markup = require('telegraf/markup')
, {setTimeout} = require('timers')
, mysql = require('mysql')
, getClassifica = (CodUte) => new Promise((resolve, reject) => {
  const risultati = []
    , connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'EnerbotDb'
    });
    connection.connect();

    connection.query(`SELECT CodUtente, sum(Punteggio) as punti from (
      select CodUtente, punteggio
      from appartamento app
      join abita a
      on a.CodAppartamento = app.CodAppartamento
      and a.attuale = true
      and app.classe = (
          select classe
          from appartamento app2
          join abita a2 on app2.CodAppartamento = a2.CodAppartamento and a2.attuale = true
          join utente u2 on u2.CodUtente = '${CodUte}'
      )
    ) group by CodUtente
    order by punti desc`, function (error, results, fields) {
      if (error) {
        return reject(error);
      };

      return resolve(results.map(elm => elm.Domanda));
    });

    connection.end();
})

module.exports = Scene => {
    const index = new Scene('Classifica settimanale')
        , sceneMenu = ['Indietro']
        , sceneKeyboard = Markup
        .keyboard(sceneMenu)
        .resize()
        .extra();

    index.enter(ctx => {
        console.info(`Serving Classifica settimanale to ${ctx.session.username}`);
        let classifica = await getClassifica(ctx.from.id);
        var i=0;
        for (i=0;i<10;i++){
          ctx.reply(`'${classifica[i].CodUtente}' con '${classifica[i].Punteggio}'`, sceneKeyboard);
        }
        ctx.reply(classifica.CodUtente, sceneKeyboard);
        i=0;
        classifica.forEach(elm, ctx => {
          i++;
          if (elm.CodUtente = ctx.from.id){
            break;
          }
        });
        let posizione = i+1;
        ctx.reply(`Ti trovi in '${posizione}' con ${classifica[i].punteggio} `,sceneKeyboard);
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from Classifica settimanale to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });


    function getClassifica() {
        return "Classifica da implementare"
    }

  return index;
};
