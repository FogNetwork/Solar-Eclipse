const html = require("./html");
const css = require("./css");
const js = require("./js");

module.exports.html = function(req, res, code, prefix) {
return html(req, res, code, prefix);
}

module.exports.css = function(req, res, code, prefix) {
return css(req, res, code, prefix);
}

module.exports.js = function(req, res, code, prefix) {
return js(req, res, code, prefix);
}