var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');
var colors = require('colors/safe');

var Writer = (function() {
  function Writer() {
  }

  Writer.prototype = {
    constructor: Writer,

    write: function(pages, options) {
      var destPath = path.resolve(options.dest);
      console.info(colors.bold.cyan('[Info] Output:', destPath));
      _.each(pages, (page) => {
        this.writePage(page, options);
      });
    },

    writePage: function(page, options) {
      try{
        var rel = path.relative(path.resolve(options.dest, '../') ,page.outputPath);
        fs.outputFileSync(page.outputPath, page.html);
        if(options.log) {
          console.log(colors.blue('[Log]', rel));
        }
      }
      catch(e) {
        console.error(colors.bold.underline.red('[Error] Failed Output Files'));
        throw new Error(e);
      }
    }
  };

  return Writer;
})();

module.exports = new Writer();
