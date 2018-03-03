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

    connection.query(`SELECT bb.CodUtente, sum(Punteggio) as punti from (
      select u.CodUtente, u.Punteggio
      from appartamento app
      join abita a
      on a.CodAppartamento = app.CodAppartamento
      and a.attuale = true
      and app.classe IN (
          select classe
          from appartamento app2
          join abita a2 on app2.CodAppartamento = a2.CodAppartamento and a2.attuale = true
          join utente u2 on u2.CodUtente = '${CodUte}'
      )
      join Utente u
      ON u.CodUtente = a.CodUtente
    ) as bb group by CodUtente
    ORDER BY punti `, function (error, results, fields) {

      if (error) {
        return reject(error);
      };
      return resolve(results.map(elm => ({
        'CodUte': elm.CodUtente,
        'Punteggio': elm.punti
    })));
    });

    connection.end();
});

module.exports = Scene => {
    const index = new Scene('Classifica settimanale')
        , sceneMenu = ['Indietro']
        , sceneKeyboard = Markup
        .keyboard(sceneMenu)
        .resize()
        .extra();

    index.enter(async ctx => {
        console.info(`Serving Classifica settimanale to ${ctx.session.username}`)
        debugger
        let classifica = await getClassifica(10033)
        //let classifica = await getClassifica(ctx.from.id) da utilizzare in un utilizzo reale con dati reali
        var i=0;
        for (i=0;i<10;i++){
          ctx.reply(`'${classifica[i].CodUte}' con '${classifica[i].Punteggio}'`, sceneKeyboard);
        }
        i=0;
        var posizione=0;
        /*classifica.forEach(elm => {
          i++;
          if (elm.CodUtente === ctx.from.id){
            posizione = i+1;
          }
        });
        concole.log(posizione)
       ctx.reply(`Ti trovi in '${posizione}' con ${classifica[i].Punteggio} `,sceneKeyboard);*/
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from Classifica settimanale to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });

  return index;
};
