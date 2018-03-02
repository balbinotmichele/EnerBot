/*global require,module,console*/
const Markup = require('telegraf/markup');

module.exports = Scene => {
  const index = new Scene('FAQ')
    , sceneMenu = [
      ['Certificazione energetica'],
      ['Quesiti tecnico-procedurali'],
      ['Soggetti certificatori'],
      ['Indietro']
    ]
    , sceneKeyboard = Markup
      .keyboard(sceneMenu)
      .resize()
      .extra();

  index.enter(ctx => {
    console.info(`Serving FAQ to ${ctx.session.username}`);
    ctx.reply('Qual è la tua domanda?', sceneKeyboard);
  });

  index.hears('Indietro', async ctx => {
    console.info(`Navigation from FAQ to Menu`);
    await index.leave();
    await ctx.scene.enter('menu');
  });

  sceneMenu.forEach(elm => { //setta l'ingresso in ogni scena
    index.hears(elm, async ctx => {
      console.info(`Navigation from index to ${elm}`);
      //ctx.reply(getRisposta(elm[0]), sceneKeyboard);
      await index.leave();
      await ctx.scene.enter(elm[0]);
    });
  });

  function getRisposta(domanda) {
      return "Risposta a "+domanda+" non implementata"
  }
  return index;
};
