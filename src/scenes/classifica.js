const Markup = require('telegraf/markup');

module.exports = Scene => {
    const index = new Scene('Classifica settimanale')
        , sceneMenu = ['Indietro']
        , sceneKeyboard = Markup
        .keyboard(sceneMenu)
        .resize()
        .extra();

    index.enter(ctx => {
        console.info(`Serving index to ${ctx.session.username}`);
        let classifica = getClassifica(); //getClassifica da implementare
        ctx.reply(classifica, sceneKeyboard);
    });

    index.hears('Indietro', async ctx => {
        console.info(`Navigation from index to Menu`);
        await index.leave();
        await ctx.scene.enter('menu');
    });


    function getClassifica() {
        return "Classifica da implementare"
    }

  return index;
};
