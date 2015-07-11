var htmlparser = require("htmlparser2")

module.exports = function(app) {
  function parseHtml(html, callback) {
    var data = []
    var parser = new htmlparser.Parser({
      onopentag: function(name, attribs) {
        console.log(1, name, attribs)
      },
      onattribute: function(name, value) {
        console.log(2, name, value)
      },
      ontext: function(text) {
        console.log(3, "-->", text);
      },
      onclosetag: function(tagname){
        console.log(4, tagname)
      },
      onend: function() {
        callback(data)
      }
    }, {
      decodeEntities: true
    })

    parser.end(html)
  }

  sails.config.queue.consumer("block", function(queue) {
    sails.log.info("Block Worker Started")

    queue.handle("block", function(job, ack) {
      sails.log.info('Block ID: ' + job.id);

      parseHtml(job.html, function(data) {
        console.log(data)
        ack()
      })
    })
  })
}
