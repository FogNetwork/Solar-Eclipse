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