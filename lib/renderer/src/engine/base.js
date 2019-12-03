var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
var Moment = require('moment');
var AigisTemplateHelper = require('../helper');
var marked = require('marked');
var util = require('util');
var pkginfo = require(appRoot + '/package.json');

var Renderer = (function() {
  function Renderer(components, options) {
    this.options = options;
    this.components = components;
    this.initialize();
  }

  Object.assign(Renderer.prototype, {
    initialize: function() {
      this.timestamp = this._getTimestamp();
      this.version = this._getVersion();
      this.indexTemplate = this._loadTemplate('index');
      this.helper = new AigisTemplateHelper(this.options);
    },

    render: function() {
      var collection = {};
      _.each(this.options.output_collection, (type) => {
        collection[type] = this._categorizeByType(type);
      });

      var pages = _.map(_.keys(collection), (type) => {
        return this._renderCollection(collection[type], type);
      });

      pages = _.flatten(pages);
      pages.push(this._renderIndex());
      return pages;
    },

    _renderPage: function(params) {
      var type = params.type, name = params.name || '', components = params.components || [], html = params.html || '';
      var title = params.title || name;
      var fileName = params.fileName || 'index.html';
      var template = this.indexTemplate;
      name = name.replace(/\s+/g, '-');
      var outputPath = path.join(this.options.dest, type, name, fileName);
      var root = params.isIndex ? './' : this._getRoot(outputPath);
      var outputRelPath = path.relative(this.options.dest, outputPath)

      this.helper.setProperty({
        collection: this.options.collection,
        root: root,
        outputPath: outputRelPath
      });

      components = _.map(components, (component) => {
        component.html = marked(component.md);
        return component
      });

      var page = template({
        components: components,
        logoSrc: params.logoSrc,
        html: html,
        config: this.options,
        timestamp: this.timestamp,
        version: this.version,
        title: title,
        category: name.split('/')[0],
        root: root,
        helper: this.helper,
        outputPath: outputRelPath
      });

      return {
        html: page,
        outputPath: outputPath
      }
    },

    _renderIndex: function() {
      var md = '', html = '';
      if(this.options.index) {
        md = fs.readFileSync(this.options.index, 'utf-8');
        html = marked(md);
      }
      var page = this._renderPage({
        title: 'index',
        type: '',
        html: html,
        isIndex: true,
        fileName: 'index.html'
      });
      return page;
    },

    _renderCollection: function(categorizedModules, type) {
      var pages = _.map(categorizedModules, (components, name) => {
        return this._renderPage({
          components: components,
          name: name,
          type: type,
          title: name.split('/').pop()
        });
      });
      return pages;
    },

    _loadTemplate: function(fileName) {
      
    },

    /*
    * @method _categorizeByType
    *
    * categorize components by output_collection option
    * */
    _categorizeByType: function(type) {
      var categorizedModules = {};
      _.each(this.options.collection[type], function(name) {
        categorizedModules[name] = [];
      });
      _.each(this.components, function(component) {
        if (_.isUndefined(component.config[type])) return;
        var category;
        if (_.isArray(component.config[type])) {
          category = component.config[type];
        }
        else {
          category = [component.config[type]]
        }
        _.each(category, function(name) {
          categorizedModules[name].push(component);
        });
      });

      return categorizedModules;
    },

    _getRoot: function(outputPath) {
      var level = _.compact(outputPath
          .replace(path.normalize(this.options.dest + '/'), '')
          .replace('index.html', '')
          .split(path.sep)
      ).length;
      var root = '';
      if (level === 0) {
        return './';
      }

      for(var i = 0; i < level; i++) {
        root += '../';
      }

      return root;
    },

    _getTimestamp: function() {
      return Moment().format(this.options.timestamp_format);
    },
    
    _getVersion: function() {
        return pkginfo.version;
    }

  });

  return Renderer;
})();

module.exports = Renderer;
