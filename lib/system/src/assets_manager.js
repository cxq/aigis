var _ = require('lodash');
var shell = require('shelljs');

var AssetsManager = (function() {
  function AssetsManager() {

  }

  AssetsManager.prototype.copy = function(src, dest) {
    shell.cp('-R', src, dest);
  };

  AssetsManager.prototype.delete = function(src) {
    shell.rm('-rf', src);
  };

  AssetsManager.prototype.copyAssets = function(options) {
    var src = options.dependencies;
    var dest = options.dest;
    
    //Copy the core assets
    var assets_dest = dest + '/' + options.assets_dest;
  
    shell.mkdir('-p', assets_dest);
    this.copy(options.core_assets_dir, dest);
    
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
