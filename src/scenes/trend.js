const Markup = require('telegraf/markup');

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
        console.info(`Serving index to ${ctx.session.username}`);
        let trend = getTrend(); //getTrend da implementare
        ctx.reply(trend, sceneKeyboard);
    });

    index.hears('Profilo personale', async ctx => {
        console.info(`Navigation from index to Menu`);
        await index.leave();
        await ctx.scene.enter('menu'); //da cambiare con 'Profilo personale' scene
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from index to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });


    function getTrend() {
        return "trend da implementare"
    }

  return index;
};
