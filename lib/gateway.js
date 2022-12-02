const fetch = require("node-fetch");
//remove fetch later

module.exports = async function(req, res, prefix) {
if (!req.query.url) return res.send("Search or Enter a URL")
try {
var website = await fetch(req.query.url)
res.redirect(prefix + req.query.url)
} catch {
try {
var website = await fetch("https://" + req.query.url)
res.redirect(prefix + "https://" + req.query.url)
} catch {
res.redirect(prefix + "https://www.google.com/search?q=" + req.query.url)
}
}
}