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