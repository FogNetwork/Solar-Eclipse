const csstree = require('css-tree');

module.exports.request = function(req, res, headers, prefix) {
var link = req.url.split(prefix)[1]

delete headers["host"]
delete headers["accept-encoding"]
delete headers["cache-control"]
delete headers["upgrade-insecure-requests"]

headers["host"] = new URL(link).hostname
headers["origin"] = new URL(link).origin
headers["referrer"] = new URL(link).href
return headers;
}

module.exports.response = function(req, res, headers, prefix) {
var link = req.url.split(prefix)[1]

delete headers['content-length']
delete headers['content-security-policy']
delete headers['content-security-policy-report-only']
delete headers['strict-transport-security']
delete headers['x-frame-options']
delete headers['x-content-type-options']
return headers;
}