const Markup = require('telegraf/markup');

module.exports = Scene => {
  const index = new Scene('menu')
    , sceneMenu = [
      ['Suggerimenti per risparmiare'],
      ['Inserimento dati contatore'],
      ['Trend personale'],
      ['Classifica settimanale'],
      ['FAQ']
    ]
    , sceneKeyboard = Markup
      .keyboard(sceneMenu)
      .resize()
      .extra();

  index.enter(ctx => {
    console.info(`Serving index to ${ctx.session.username}`);

    ctx.reply('Cosa vuoi visualizzare?', sceneKeyboard);
  });

  sceneMenu.forEach(elm => { //setta l'ingresso in ogni scena
    index.hears(elm, async ctx => {
      console.info(`Navigation from index to ${elm}`);
      await index.leave();
      await ctx.scene.enter(elm[0]);
    });
  });

  return index;
};
