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
        console.info(`Serving Trend personale to ${ctx.session.username}`);
        let trend = getTrend(); //getTrend da implementare
        ctx.reply(trend, sceneKeyboard);
    });

    index.hears('Profilo personale', async ctx => {
        console.info(`Navigation from Trend personale to Profilo personale`);
        await index.leave();
        await ctx.scene.enter('Profilo personale'); //da cambiare con 'Profilo personale' scene
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from Trend personale to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });


    function getTrend() {
        return "trend da implementare"
    }

  return index;
};
