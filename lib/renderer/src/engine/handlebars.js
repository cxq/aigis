var hbs = require('handlebars');
var fs = require('fs-extra');
var path = require('path');
var util = require('util');
var base = require('./base');

var HBS_Renderer = (function () {
  function HBS_Renderer(components, options) {
    this.options = options;
    this.components = components;
    this.initialize();
  }

  util.inherits(HBS_Renderer, base);

  Object.assign(HBS_Renderer.prototype, {
    initialize: function () {
      base.prototype.initialize.call(this);
      var _this = this;
      hbs.registerHelper('include', function (includePath, options) {
        var template = _this._loadTemplate(includePath, options.hash.isComponentDir);

        return new hbs.SafeString(template(this));
      });

      hbs.registerHelper('renderCollectionTree', function (type, options) {
        _this.helper.setProperty({
          collection: _this.options.collection,
          root: options.data.root.root
        });

        var keyName = options.hash.key;

        if (keyName) {
          return _this.helper.renderCollectionTree(type)[keyName]
        } else {
          return _this.helper.renderCollectionTree(type);
        }
      });

      hbs.registerHelper('each', function (context, options) {
        var ret = "";

        for (var i = 0, j = context.length; i < j; i++) {
          ret = ret + options.fn(context[i]);
        }

        return ret;
      });

      hbs.registerHelper('or', function (context, options) {
        var len = arguments.length - 1;
        options = arguments[len];

        for (var i = 0; i < len; i++) {
          if (arguments[i]) {
            return options.fn(this);
          }
        }

        return options.inverse(this);
      });

      hbs.registerHelper('not_equal', function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue === rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      });

      hbs.registerHelper('var', function (varname, options) {
        var htmlString =
          options.fn(this) // generate string
            .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); //trim string
        this[varname] = htmlString.replace(/(\r\n|\n|\r)/gm, '');
        return '';
      });
    },
    _loadTemplate: function (fileName, isComponentDir) {
      var ext = this.options.template_ext[this.options.template_engine];
      var templateDir = isComponentDir ? this.options.template_dir : this.options.core_template_dir;
      var filePath = path.join(templateDir, fileName + ext);

      try {
        var template = fs.readFileSync(filePath, 'utf-8');
        return hbs.compile(template);
      }
      catch (e) {
        throw new Error(e);
      }
    }
  });

  return HBS_Renderer;
})();

module.exports = HBS_Renderer;
