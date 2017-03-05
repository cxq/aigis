var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');

var AssetsManager = (function() {
  function AssetsManager() {

  }

  AssetsManager.prototype.copy = function(src, dest) {
    fs.copySync(src, path.join(dest, path.basename(src)));
  };

  AssetsManager.prototype.delete = function(src) {
    fs.removeSync(src);
  };

  AssetsManager.prototype.copyAssets = function(options) {
    var src = options.dependencies;
    var dest = options.dest;
    
    this.delete(dest);
    
    //Copy the core assets
    this.copy(options.core_assets_dir, dest);
    
    var assets_dest = dest + '/' + options.assets_dest;
    
    if (_.isArray(src)) {
      _.each(src, function(src) {
        this.copy(src, assets_dest);
      }, this);
    }
    else {
      this.copy(src, assets_dest);
    }
  };
  return AssetsManager;
})();

module.exports = new AssetsManager();
