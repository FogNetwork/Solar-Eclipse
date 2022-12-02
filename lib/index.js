const https = require("https");
const http = require("http");
const fs = require("fs");
const rewrite = require("./rewrite");
const headersrewrite = require("./headers");
const gateway = require("./gateway");
const urlrewrite = require("./rewrite/url");

module.exports = class Eclipse {
  constructor(config) {
  this.prefix = config.prefix || "/service/"
  }
  async request(req, res) {
  var client_client = fs.readFileSync(__dirname + "/client/client.js", {encoding: "utf8"})
  var client_location = fs.readFileSync(__dirname + "/client/location.js", {encoding: "utf8"})
  var client_xml = fs.readFileSync(__dirname + "/client/xml.js", {encoding: "utf8"})
  var client_document = fs.readFileSync(__dirname + "/client/document.js", {encoding: "utf8"})
  fs.writeFileSync(__dirname + "/client/index.js", client_client + "\n\n" + client_location + "\n\n" + client_xml + "\n\n" + client_document + "\n\ndocument.currentScript.remove()")
    
  if (req.url.startsWith(this.prefix + "gateway")) {
  return gateway(req, res, this.prefix);
  }

  if (req.url == this.prefix + "index") {
  return res.sendFile(__dirname + "/client/index.js");
  }
  
  if (req.url == this.prefix + "main") {
  var main = fs.readFileSync('lib/client/main.js', 'utf8')
  main = main.replace("%PREFIX%", "'" + this.prefix + "'")
  return res.send(main);
  }

  var link = req.url.split(this.prefix)[1]

  try {
  var resheaders = Object.assign({}, req.headers)
  var resprefix = this.prefix
  var rewrittenheaders = headersrewrite.request(req, res, resheaders, resprefix)
  var options = {
  method: req.method,
  headers: rewrittenheaders
  }
  var requestProtocol = link.startsWith('https') ? https : http
  var requestData = requestProtocol.request(link, options, (response) => {
  if (response.headers.location) {
  return res.redirect(urlrewrite(response.headers.location, req.url.split(this.prefix)[1], req.protocol + "://" + req.get("host") + this.prefix));
  }
  var chunks = [];
  response.on("data", chunk => chunks.push(chunk)).on("end", () => {
  var code = Buffer.concat(chunks)
  var contentType = response.headers["content-type"] || ""
  if (req.method == "POST") {
    contentType = ""
  }
  switch (contentType.split(";")[0]) {
  case "text/html":
    code = rewrite.html(req, res, code.toString(), this.prefix);
    break;
  case "text/css":
    code = rewrite.css(req, res, code.toString(), this.prefix);
    break;
  case "text/javascript":
    code = rewrite.js(req, res, code.toString(), this.prefix);
    break;
  case "text/javascript":
    code = rewrite.js(req, res, code.toString(), this.prefix);
    break;   
  case "text/js":
    code = rewrite.js(req, res, code.toString(), this.prefix);
    break;
  case "application/javascript":
    code = rewrite.js(req, res, code.toString(), this.prefix);
    break;
  default:
    code = code
    break;
  }
  res.writeHead(response.statusCode, headersrewrite.response(req, res, response.headers, resprefix)).end(code)
  })
  }).on("error", error => res.end(error))
  if (!res.writableEnded) {
  req.on("data", (data) => requestData.write(data)).on("end", () => requestData.end())
  } else {
  requestData.end()
  }
  } catch(err) {
  console.log(err.code || err)
  res.send(err.code || err)
  }
  }
}

/*
module.exports.request = async function(req, res, config) {
const website = await fetch(req.query.url)
if (website.headers.get("Content-Type").startsWith("text/html")) {
var code = await website.text()
res.set('Content-Type', website.headers.get("Content-Type"))
code = rewrite.html(req, res, code, config.prefix);
res.send(code)
} else if (website.headers.get("Content-Type").startsWith("image/")) {
const buffer = await website.buffer();
res.set('Content-Type', website.headers.get("Content-Type"))
res.send(buffer)
} else {
const code = await website.text()
res.set('Content-Type', website.headers.get("Content-Type"))
res.send(code)
}
}
*/