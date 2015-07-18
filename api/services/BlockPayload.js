var htmlparser = require("htmlparser2")
var nodeMap = {
  strong: "bold",
  em: "italic",
  u: "underline",
  del: "strikethrough"
}
var styleMap = {
  "font-weight": ["bold", true],
  "text-align": ["alignment", null],
  "color": ["color", null],
  "background": ["background", null]
}

function cloneAttribs(attribs) {
  return JSON.parse(JSON.stringify(attribs))
}

function proccessNode(element, attribs, payload) {
  if(element.name == "variable") {
    return proccessVariable(element, attribs, payload)
  } else if(element.name == "br") {
    return proccessBreak(attribs, payload)
  } else if(element.type == "text") {
    return processText(element, attribs, payload)
  }

  if(element.name in nodeMap) {
    attribs[nodeMap[element.name]] = true
  }

  if("style" in element.attribs) {
    element.attribs.style.split(";").forEach(function(attrib) {
      attrib = attrib.split(":")

      if(attrib.length < 2) return

      attrib[0] = attrib[0].trim()
      attrib[1] = attrib[1].trim()

      if(!(attrib[0] in styleMap)) return

      style = styleMap[attrib[0]]
      attribs[style[0]] = style[1] || attrib[1]
    })
  }

  return Promise.each(element.children, function(child) {
    return proccessNode(child, cloneAttribs(attribs), payload)
  })
}

function proccessBreak(attribs, payload) {
  return Promise.resolve().then(function() {
    return payload.push({
      type: "text",
      text: "\n",
      attributes: attribs
    })
  })
}

function processText(element, attribs, payload) {
  return Promise.resolve().then(function() {
    return payload.push({
      type: "text",
      text: element.data,
      attributes: attribs
    })
  })
}

function proccessVariable(element, attribs, payload) {
  return Promise.resolve().then(function() {
    return payload.push({
      type: "variable",
      source: element.attribs["data-source"],
      variable: element.children[0].data.trim(),
      attributes: attribs
    })
  })
}


module.exports = function(html) {
  return new Promise(function(resolve, reject) {
    var handler = new htmlparser.DomHandler(function (error, dom) {
      if(error) return reject(error)
      resolve(dom)
    })

    var parser = new htmlparser.Parser(handler, {
      decodeEntities: true
    })
    parser.done(html)
  }).then(function(dom) {
    var payload = []

    return Promise.each(dom, function(element) {
      return proccessNode(element, {}, payload)
    }).then(function() {
      return payload
    })
  })
}
