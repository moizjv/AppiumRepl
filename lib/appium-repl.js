var wd     = require('wd');
var repl   = require('repl');
require('colors');
var telme  = require('telme-promise');

module.exports = {
  run: function(config) {
    global.driver = wd.remote(config.hostname, config.port, config.username, config.password);
    global.driver.on('status', function(info) {
      console.log(info.cyan);
    });
    global.driver.on('command', function(meth, path, data) {
      console.log(' > ' + meth.yellow, path.grey, data || '');
    });

    global.current = {};
    global.handler = function(error, el){
      if (error) {
        console.log('error', error);
      }
      else if(typeof el === 'object'){
        console.log("Returned in current");
        global.current = el;
      }
      else {
        console.log("Returned following string",el);
      }

    };

    global.quit = function(){
      global.driver.quit(function(){
        process.exit(1);
      });
    };

    var replProfile = function(caps) {
      caps.newCommandTimeout = 1000;
      console.log("Caps + : ", caps);
      global.driver.init(caps, function(){
        console.log('driver started');
        var r = repl.start({prompt:'>>', useGlobal: true});
        r.on('exit', global.quit);
      });
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
