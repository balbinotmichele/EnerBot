const Markup = require('telegraf/markup');

module.exports = Scene => {
    const index = new Scene('Suggerimenti per risparmiare')
        , sceneMenu = ['Indietro']
        , sceneKeyboard = Markup
        .keyboard(sceneMenu)
        .resize()
        .extra();

    index.enter(ctx => {
        console.info(`Serving index to ${ctx.session.username}`);
        let consigli = getConsigli(); //getConsigli da implementare
        ctx.reply(consigli, sceneKeyboard);
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from index to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });


    function getConsigli() {
        return "Da implementare"
    }

  return index;
};
