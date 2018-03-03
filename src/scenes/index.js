const {resolve} = require('path')
, {readdirSync} = require('fs')
, Stage = require('telegraf/stage')
, Scene = require('telegraf/scenes/base')
, stage = new Stage()
, scenes = Promise.all(readdirSync(__dirname)
    .filter(elm => elm !== 'index.js' && elm.endsWith('.js'))
    .map(elm => {
      console.info(`Configuring state ${elm}...`);

      return require(resolve(__dirname, elm))(Scene);
    }))
    .then(results => {
      return results.reduce((prev, curr) => {
        stage.register(curr);
        return stage;
      }, undefined);
    });


scenes.landingScene = 'menu'; //scena landingScene collegata a 
module.exports = scenes;
