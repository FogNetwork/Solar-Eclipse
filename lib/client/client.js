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