var wd     = require('wd');
var repl   = require('repl');
require('colors');
var telme  = require('telme-promise');
var promirepl = require('promirepl').promirepl;
module.exports = {
  run: function(config) {
    var driver = wd.promiseRemote(config.hostname, config.port, config.username, config.password);
    driver.on('status', function(info) {
      console.log(info.cyan);
    });
    driver.on('command', function(meth, path, data) {
      console.log(' > ' + meth.yellow, path.grey, data || '');
    });

    var quit = function(){
      driver.quit(function(){
        process.exit(1);
      });
    };


    var reset = function(context) {
      context.driver = driver;
      context.quit = quit;
    };

    var replProfile = function(caps) {
      caps.newCommandTimeout = 1000;
      console.log("Caps + : ", caps);
      driver.init(caps).then(function() {
        console.log('driver started');
        var r = repl.start({prompt:'>>', useGlobal: true});

        promirepl(r);
        delete r.commands['.promise'];

        reset(r.context);
        r.on('reset', reset);
        r.on('exit',quit);
      }).catch(console.error.bind(console));
    };

    var getProfile = function () {
      telme("Enter the profile you wish to start.\nAnd enter exit to finish.").then(function(str){
        if(str && str!="exit") {
          var caps = config.profiles[str];
          if (caps) {
            replProfile(caps);
          }
          else {
            console.log("Incorrect choice!!");
            getProfile();
          }
        }
      });
    };

    if (Object.keys(config.profiles).length === 0) {
      var profileKeys = Object.keys(config.profiles);
      console.log(' Profiles '.green);
      console.log('=========='.green);
      profileKeys.forEach(function(key){
        console.log(key);
      });

      getProfile();
    } else {
      var caps = config.profiles[Object.keys(config.profiles)[0]];
      replProfile(caps);
    }
  }
};
