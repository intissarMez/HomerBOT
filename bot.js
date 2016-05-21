var Bot = require('slackbots');
var data = require('./data.json');
var fs = require('fs');
var settings = {
    token: 'YOUR TOKEN GOES HERE'
};
var bot = new Bot(settings);


/*Control the welcome message by updating this file : data.json*/
bot.updateBotFirstLogin = function (){
  data.firstConnect = false
  fs.writeFile('./data.json', JSON.stringify(data), function (err) {
    if (err) return console.log(err);
  });
}


bot.isHomerNameDetected = function (message) {
    if(message.type === 'message' && message.text){
      return message.text.toLowerCase().indexOf('homer') > -1
    }
};


bot.getCurrentChannel = function(channelId) {
  var currentChannel = function(el){
      return el.id === channelId;
  }
    return bot.channels.filter(currentChannel)[0];
};

bot.replyWithQuote = function (message) {
  var channel = this.getCurrentChannel(message.channel);
  if(message.channel[0] === 'C'){
      /*Get a Random quote from a json file... database can be used instead*/
      var quotes = JSON.parse(fs.readFileSync('./data.json', 'utf-8')).quotes;
      var randomQuote = Math.floor(Math.random() * quotes.length);
      var quote = quotes[randomQuote];

    bot.postMessageToChannel(channel.name, quote.content, {as_user: true});
  }
}

/*Display hello message only the first time when the bot run*/
bot.on('start', function() {
  if(data.firstConnect){
    bot.postMessageToChannel(bot.channels[0].name, 'Howdy homies, feel free to invoke me by typing my name!',{as_user: true});
    bot.updateBotFirstLogin();
  }

});

/*Detect when the name Homer is typed and answer with a quote from the JSON file*/
bot.on('message', function(message){
  if (bot.isHomerNameDetected(message)) {
      bot.replyWithQuote(message);
  }
});
