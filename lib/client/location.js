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