var path = require("path");

var opts = require("nomnom")
  .option("config", {
         default: path.join(process.cwd(), ".appium-repl.json"),
         help: "Config file"
  })
  .option("hostname", {
         default: (process.env.SELENIUM_HOST || "localhost"),
         help: "Appium Hostname"
  })
  .option("port", {
         default: (process.env.SELENIUM_PORT || "4723"),
         help: "Appium Port"
  })
  .option("username", {
         default: process.env.SAUCE_USERNAME,
         help: "Appium Username"
  })
  .option("password", {
         default: process.env.SAUCE_ACCESS_KEY,
         help: "Appium Username"
  })
  .parse();

var repl = require("../lib/appium-repl.js");
var config = {
  profiles: require(opts.config),
  hostname: opts.hostname,
  port: opts.port,
  user: opts.username,
  pwd: opts.password
};
repl.run(config);
