var htmlparser = require("htmlparser2")

module.exports = function(app) {
  function parseHtml(html, callback) {
    var parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
        if(name === "script" && attribs.type === "text/javascript"){
          console.log("JS! Hooray!");
        }
      },
      ontext: function(text){
        console.log("-->", text);
      },
      onclosetag: function(tagname){
        if(tagname === "script"){
          console.log("That's it?!");
        }
      }
    }, {
      decodeEntities: true
    })
  }

  sails.config.queue.consumer("block", function(queue) {
    sails.log.info("Block Worker Started")

    queue.handle("block", function(job, ack) {
      sails.log.info('Block ID: ' + job.id);
      //parser.write(job.html);
      ack();
    })
  })
}
