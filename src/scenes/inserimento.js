const Markup = require('telegraf/markup');

module.exports = Scene => {
  const index = new Scene('Inserimento dati contatore')
    , sceneMenu = [
        ['Inserisci dati contatore gas'], 
        ['Indietro']
    ]
    , sceneKeyboard = Markup
      .keyboard(sceneMenu)
      .resize()
      .extra();

  index.enter(ctx => {
    console.info(`Serving index to ${ctx.session.username}`);
    ctx.reply('Cosa vuoi fare?', sceneKeyboard);
  });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from index to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });

    index.hears('Inserisci dati contatore gas', async ctx => {
        console.info(`Navigation from index to Menu`);
        ctx.reply('Da implementare')
        await index.leave();
        await ctx.scene.enter('menu'); //da cambiare con scena inserimento dati
    });

  return index;
};
