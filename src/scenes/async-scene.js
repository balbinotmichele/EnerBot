/*global require,module,console*/
const Markup = require('telegraf/markup')
, {setTimeout} = require('timers')
, somethingAsync = () => new Promise(resolve => {
  return setTimeout(() => resolve([
    'one',
    'two'
  ]), 400);
});

module.exports = async Scene => {
  const asyncScene = new Scene('async-scene')
    , sceneMenu = await somethingAsync()
    , sceneKeyboard = Markup
      .keyboard(sceneMenu)
      .resize()
      .extra();

  asyncScene.enter(ctx => {
    console.info(`Serving async-scene to ${ctx.session.username}`);

    ctx.reply('Seleziona', sceneKeyboard);
  });

  sceneMenu.forEach(elm => {

    asyncScene.hears(elm, async ctx => {

      console.info(`Navigation from async-scene to ${elm}`);
      await asyncScene.leave();
      await ctx.scene.enter(elm);
    });
  });

  return asyncScene;
};
