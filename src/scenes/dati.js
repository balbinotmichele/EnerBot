const Markup = require('telegraf/markup')
, {setTimeout} = require('timers')
, mysql = require('mysql')
, getUserData = (userid) => new Promise((resolve, reject) => {
    console.log(userid);
    const risultati = []
      , connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'root',
          password : '',
          database : 'EnerbotDb'
      });
      connection.connect();
      let query = "SELECT CodAppartamento FROM abita WHERE CodUtente = " + userid + "' AND Attuale = 1";
      console.log(query);
      connection.query(query, function (error, results, fields) {
        return resolve(results.map(elm => elm.CodAppartamento));
      });

      connection.end();
  })
, insertData = (contatore, codapp) => new Promise((resolve, reject) => {
    const risultati = []
      , connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'root',
          password : '',
          database : 'EnerbotDb'
      });
      connection.connect();
      let query = "INSERT INTO Lettura(Contatore, DataOra) VALUES ('"+contatore+"', '"+ new Date().toISOString() +"', '"+ codapp +"')";
      console.log(query);
      connection.query(query, function (error, results, fields){
          console.log(results);
      });

      connection.end();
  });

module.exports = async Scene => {
  const index = new Scene('dati')
  , sceneMenu = ['Indietro']
  , sceneKeyboard = Markup
      .keyboard(sceneMenu)
      .resize()
      .extra();

    index.enter(ctx => {
        console.info(`Serving Inserimento dati to ${ctx.session.username}`);
        ctx.reply('Inserisci il valore del contatore (usa la tastiera del tuo dispositivo)', sceneKeyboard);
    });

    //index.hears(/[^abcdefghijklmnopqrstuvwxyz]/i, async ctx => {
    index.hears(/[0-9]/i, async ctx => {
        let codapp = await getUserData(ctx.from.userId)[0];
        console.log(codapp);
        //await insertData(ctx.message.text, codapp);
        ctx.reply("Da implementare");
        await index.leave();
        await ctx.scene.enter('menu'); //da cambiare eventualmente
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from Dati to Inserimento dati`);
        await index.leave();
        await ctx.scene.enter('Inserimento dati contatore');
    });

    index.hears(/[^0-9]/i, async ctx => {
        ctx.reply("Inserire valori numerici");
    });



  return index;
};
