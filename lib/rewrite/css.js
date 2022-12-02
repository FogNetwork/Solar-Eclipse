const csstree = require('css-tree');
const urlrewrite = require("./url");

module.exports = function(req, res, code, prefix, context) {
const css = csstree.parse(code, {
  context: context || "stylesheet"
});

var urls = csstree.findAll(css, node => 
node.type == "Url")

for (aurl in urls) {
var link = urls[aurl]
link.value = urlrewrite(link.value, req.url.split(prefix)[1], req.protocol + "://" + req.get("host") + prefix)
}

/*
var imports = csstree.findAll(css, node => 
node.type == "Atrule" && node.name == "import" && node.prelude && node.prelude.type == "AtrulePrelude")

for (aimport in imports) {
var link = imports[aimport].prelude.children.head.data
link.value = urlrewrite(req, res, link.value, prefix)
}
*/

return csstree.generate(css)
}