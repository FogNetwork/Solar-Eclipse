/*
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const urlrewrite = require("./url")

module.exports = function(req, res, code, prefix) {
var dom = new JSDOM(code)
function replacelink(elem, attr) {
var links = dom.window.document.getElementsByTagName(elem)
for (link in links) {
if (links[link][attr]) {
links[link][attr] = urlrewrite(req, res, links[link][attr], prefix)
}
}
}

replacelink("a", "href")
replacelink("img", "src")
replacelink("script", "src")
replacelink("link", "href")
replacelink("link", "href")
replacelink("iframe", "src")

code = dom.serialize()
return code;
}

*/
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const urlrewrite = require("./url");
const css = require("./css");
const js = require("./js");

module.exports = function(req, res, code, prefix) {
var dom = new JSDOM(code)

var HTML_REWRITER = [
  {
    attrs: ["href", "src", "action", "ping", "profile", "movie", "poster", "background", "data"],
    action: "rewrite"
  },
  {
    attrs: ["srcset"],
    action: "srcset"
  },
  {
    elements: ["style"],
    action: "elem-css"
  },
  {
    attrs: ["style"],
    action: "css"
  },
  {
    elements: ["script"],
    action: "elem-js"
  },
  {
    attrs: ["onclick"],
    action: "js"
  },
  {
    attrs: ["http-equiv", "nonce", "integrity", "crossorigin"],
    action: "delete"
  },
  {
    config: {prefix: prefix, url: req.url, host: req.get('host')},
    action: "inject"
  }
]

for (config in HTML_REWRITER) {
if (HTML_REWRITER[config].action == "rewrite") {
  HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.window.document.querySelectorAll(`*[${attr}]`)
    for (aelem in allelems) {
      if (allelems[aelem][attr]) {
        allelems[aelem][attr] = urlrewrite(allelems[aelem][attr], req.url.split(prefix)[1], req.protocol + "://" + req.get("host") + prefix)
      }
    }
  })
} else if (HTML_REWRITER[config].action == "css") {
    HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.window.document.querySelectorAll(`*[${attr}]`)
    for (aelem in allelems) {
      if (allelems[aelem][attr]) {
        allelems[aelem].setAttribute(attr, css(req, res, allelems[aelem].getAttribute(attr), prefix, "declarationList"))
      }
    }
  })
} else if (HTML_REWRITER[config].action == "js") {
    HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.window.document.querySelectorAll(`*[${attr}]`)
    for (aelem in allelems) {
      if (allelems[aelem].nodeType && allelems[aelem].getAttribute(attr)) {
        allelems[aelem].setAttribute(attr, js(req, res, allelems[aelem].getAttribute(attr), prefix))
      }
    }
  })
} else if (HTML_REWRITER[config].action == "delete") {
    HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.window.document.querySelectorAll(`*[${attr}]`)
    for (aelem in allelems) {
      if (allelems[aelem].nodeType && allelems[aelem].getAttribute(attr)) {
        allelems[aelem].removeAttribute(attr)
      }
    }
  })
} else if (HTML_REWRITER[config].action == "elem-css") {
    var styles = dom.window.document.getElementsByTagName(HTML_REWRITER[config].elements)
    for (styleelem in styles) {
      if (styles[styleelem].innerHTML) {
        styles[styleelem].innerHTML = css(req, res, styles[styleelem].innerHTML, prefix)
      }
    }
} else if (HTML_REWRITER[config].action == "elem-js") {
    var styles = dom.window.document.getElementsByTagName(HTML_REWRITER[config].elements)
    for (styleelem in styles) {
      if (styles[styleelem].innerHTML) {
        styles[styleelem].innerHTML = js(req, res, styles[styleelem].innerHTML, prefix)
      }
    }
} else if (HTML_REWRITER[config].action == "inject") {
    var inject = dom.window.document.createElement("script")
    inject.src = prefix + "index"
    var INJECT_CONFIG = JSON.parse(JSON.stringify(HTML_REWRITER[config].config))
    inject.setAttribute('eclipse-config', JSON.stringify(INJECT_CONFIG))
    dom.window.document.getElementsByTagName("head")[0].insertBefore(inject, dom.window.document.getElementsByTagName("head")[0].childNodes[0])
} else if (HTML_REWRITER[config].action == "srcset") {
  HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.window.document.querySelectorAll(`*[${attr}]`)
    for (aelem in allelems) {
      if (allelems[aelem][attr]) {
        var srcset = allelems[aelem][attr]
        var srcset2 = srcset.split(" ")
        var srcset3 = srcset2.filter(function(value, index) {
        return index % 2 == 0
        })

        for (item in srcset3) {
        srcset = srcset.replace(srcset3[item], urlrewrite(srcset3[item], req.url.split(prefix)[1], req.protocol + "://" + req.get("host") + prefix))
        }
        allelems[aelem][attr] = srcset 
      }
    }
  })
}
}

code = dom.serialize()
return code;
}