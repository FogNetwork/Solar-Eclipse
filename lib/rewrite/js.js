module.exports = function(req, res, code, prefix) {
code = code.replace(/document.location/g, "document.oLocation")
code = code.replace(/window.location/g, "window.oLocation")
code = code.replace(/window.oLocation = /g, "window.OLocation = ")
code = code.replace(/document.oLocation = /g, "document.OLocation = ")
return code;
}