var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');

var Plugin = (function() {
  function Plugin(options) {
    this.options = options;
    this.engine = {};
    this.transform = {};
    this.initialize();
  }

  Plugin.prototype = {
    constructor: Plugin,

    initialize: function() {
      if (!_.isArray(this.options.transform)) {
        this.options.transform = [this.options.transform];
      }
      this._loadBuiltinPlugins('transform');
    },

    register: function(plugin) {
      if (plugin.type === 'transform' && !_.includes(this.options.transform, plugin.name)) {
        return;
      }
      this[plugin.type][plugin.name] = plugin.fn;
    },

    get: function(type, name) {
      return this[type][name];
    },

    getTransforms: function() {
      return this.transform;
    },

    applyTransforms: function(components) {
      var options = this.options;
      components = _.reduce(this.transform, function(components, transform) {
        return transform(components, options);
      }, components);
      return components
    },

    _loadBuiltinPlugins: function(type) {
      var baseDir = path.resolve(__dirname + '/src');
      try {
        this._bulkRegister('hbs.js', type, path.join(baseDir, type));
      }
      catch (e) {
        throw new Error(e);
      }
    },

    _bulkRegister: function(filename, type, dirname) {
      var ext = path.extname(filename);
      var name = path.basename(filename, ext);
      var pluginPath = path.join(dirname, filename);
      var plugin = {
        type: type,
        name: name,
        fn: require(pluginPath)
      };
      this.register(plugin)
    }
  };

  return Plugin;
})();

module.exports = function(options) {
  return new Plugin(options);
};
