var config = JSON.parse(document.currentScript.getAttribute("eclipse-config"))
var eclipsePrefix = config.prefix
var eclipseUrl = config.url
var eclipseHost = config.host
var eclipseMain = window.location.protocol + "//" + eclipseHost + "/" + eclipseUrl

eclipseUrl = eclipseUrl.split(eclipsePrefix)[0] + eclipseUrl.split(eclipsePrefix)[1]

/*
function rewriteurl(link, prefix, eclipseUrl, eclipseHost) {
if (link.startsWith("javascript:") || link.startsWith("about:") || link.startsWith("mailto:")|| link.startsWith("data:") || link.startsWith("blob:") || link.startsWith("#")) return link;
if (link.startsWith("http://" + eclipseHost + prefix) || link.startsWith("https://" + eclipseHost + prefix)) return link;

var new_link = link
var link2;
var type;
var fullurl = new URL(eclipseUrl.split(prefix)[0]).origin
var mainurl = "https://" + eclipseHost

if (new_link.startsWith("https://") || new_link.startsWith("http://") || new_link.startsWith("//")) {
type = "full"
if (new_link.startsWith("//")) {
new_link = "https:" + new_link
link2 = new URL(new_link)
} else {
link2 = new URL(new_link)
}
} else {
if (new_link.startsWith("/") || new_link.startsWith(".")) {
type = "not full"

while (new_link.startsWith(".") || new_link.startsWith("/")) {
if (new_link.startsWith(".")) {new_link = new_link.replace(".", "")}
if (new_link.startsWith("/")) {new_link = new_link.replace("/", "")}
}
link2 = new URL(fullurl + "/" + new_link)
} else {
type = "not full"
link2 =  new URL(fullurl + "/" + new_link)
}
}

return decodeURI(mainurl + prefix + link2.href);
}
*/

function rewriteurl(url, baseUrl) {
var fullUrl = eclipseUrl;
var mainUrl = window.location.protocol + "//" + eclipseHost + eclipsePrefix;

if (url.startsWith("javascript:") || url.startsWith("about:") || url.startsWith("mailto:")|| url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("#")) return url;
if (url.startsWith(mainUrl)) return url;

try {
var webbaseurl = new URL(new URL(baseURL).href, new URL(fullUrl).href)
} catch {
var webbaseurl = new URL(fullUrl).href
}

var newurl = new URL(url, webbaseurl).toString()

return decodeURI(mainUrl + newurl)
}

window.oLocation = new Proxy({}, {
  set(obj, prop, value) {
  if (prop == "assign" || prop == "reload" || prop == "replace" || prop == "toString" || prop == "hash" || prop == "search" || prop == "protocol") return;

  return location[prop] = rewriteurl(value)
  },
  get(obj, prop) {
  if (prop == 'assign' || prop == 'reload' || prop == 'replace' || prop == 'toString' || prop == 'hash' || prop == 'search') return {
  assign: arg => window.location.assign(rewriteurl(arg)),
  replace: arg => window.location.replace(rewriteurl(arg)),
  reload: (arg) => window.location.reload(arg ? arg : null),
  toString: () => { return new URL(eclipseMain).href },
  hash: window.location.hash,
  search: window.location.search,
  protocol: location.protocol
  } [prop];
  else return new URL(eclipseMain)[prop];
  }    
})

document.oLocation = oLocation

Object.defineProperty(window, "OLocation", {
  set: function(newValue){
    if (!newValue) return;
    oLocation.href = (newValue)
  },
  get: function(){
    return this.location;
  }
});

Object.defineProperty(document, "OLocation", {
  set: function(newValue){
    if (!newValue) return;
    oLocation.href = (newValue)
  },
  get: function(){
    return this.location;
  }
});

var oldOpen = window.open
window.open = function(url, options) {
  if (url) {
  url = rewriteurl(url)
  }
  return oldOpen.apply(this, arguments)
}

var oldPushState = history.pushState

window.history.pushState = new Proxy(history.pushState, {
  apply(target, thisArg, args) {
  if (args[2]) {
  args[2] = rewriteurl(args[2])
  }
  return Reflect.apply(target, thisArg, args)
  }
});

window.history.replaceState = new Proxy(history.replaceState, {
  apply(target, thisArg, args) {
  if (args[2]) {
  args[2] = rewriteurl(args[2], eclipsePrefix, eclipseUrl, eclipseHost)
  }
  return Reflect.apply(target, thisArg, args)
  }
});

Object.defineProperty(document, 'domain', {
  get() {
    return new URL(eclipseUrl).hostname;
  },
  set(value) {
    return value;
  }
});

var oldFetch = window.fetch
window.fetch = function(url, options) {
  if (url) {
  url = rewriteurl(url)
  }
  return oldFetch.apply(this, arguments)
}

var oldXHR = window.XMLHttpRequest.prototype.open
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  if (url) {
  url = rewriteurl(url)
  }
  return oldXHR.apply(this, arguments)
}

var oldPostMessage = window.postMessage
window.postMessage = function(msg, origin, transfer) {
  if (origin) {
  origin = location.origin
  }
  return oldPostMessage.apply(this, arguments)
};

var oldSendBeacon = window.Navigator.prototype.sendBeacon
window.Navigator.prototype.sendBeacon = function(url, data) {
  if (url) {
  url = rewriteurl(url)
  }
  return oldSendBeacon.apply(this, arguments)
};

var ATTRIBUTE_REWRITER = [
    {
      attrs: ["href", "src", "action", "ping", "profile", "movie", "poster", "background", "data"],
      action: "rewrite"
    },
    {
      attrs: ["srcset"],
      action: "srcset"
    },
    {
      attrs: ["style"],
      action: "css"
    },
    {
      attrs: ["onclick"],
      action: "js"
    },
    {
      attrs: ["http-equiv", "nonce", "integrity", "crossorigin"],
      action: "delete"
    }
]

function rewriteAttribute(attr, value) {
//Rewrite
if (ATTRIBUTE_REWRITER[0].attrs.includes(attr)) {
return [attr, rewriteurl(value)]
//Srcset
} else if (ATTRIBUTE_REWRITER[1].attrs.includes(attr)) {
var srcset = value
var srcset2 = srcset.split(" ")
var srcset3 = srcset2.filter(function(value, index) {
return index % 2 == 0
})

for (item in srcset3) {
srcset = srcset.replace(srcset3[item], urlrewrite(srcset3[item], req.url.split(prefix)[1], req.protocol + "://" + req.get("host") + prefix))
}
return [attr, srcset]
//Delete
} else if (ATTRIBUTE_REWRITER[4].attrs.includes(attr)) {
return;
}
}

HTMLElement.prototype.setAttribute = new Proxy(HTMLElement.prototype.setAttribute, {
apply(target, element, args) {
if (args[0] && args[1]) {
if (rewriteAttribute(args[0], args[1])) {
args[1] = rewriteAttribute(args[0], args[1])[1]
}
}
return Reflect.apply(target, element, args)
}
})

for (attr in ATTRIBUTE_REWRITER[0].attrs) {
Object.defineProperty(HTMLElement.prototype, ATTRIBUTE_REWRITER[0].attrs[attr], {
set(value) {
  return this.setAttribute(ATTRIBUTE_REWRITER[0].attrs[attr], value);
},
get() {
  return this.getAttribute(attribute);
}
})
}

document.currentScript.remove()