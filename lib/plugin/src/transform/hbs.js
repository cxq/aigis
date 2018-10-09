var _ = require('lodash');
var hbs = require('handlebars');
var htmlBeautify = require('js-beautify').html;
var format = require('util').format;
var path = require('path');
var fs = require('fs-extra');

function getRoot(outputPath) {
  var level = _.compact(outputPath
    .split(path.sep)
  ).length;
  var root = '';
  if (level === 0) {
    return './';
  }

  for (var i = 0; i < level; i++) {
    root += '../';
  }

  return root;
}

function transform(components, options) {
  hbs.registerHelper('include', function (includePath, params) {
    var ext = path.extname(includePath).length === 0 ? '.hbs' : '';
    var filePath;

    if (Array.isArray(options.component_dir)) {
      for (var i = 0, l = options.component_dir.length; i < l; i++) {
        var compDir = options.component_dir[i];
        if (!filePath && fs.existsSync(path.join(compDir, includePath + ext))) {
          filePath = path.join(compDir, includePath + ext);
          break;
        }
      }
    } else {
      filePath = path.join(options.component_dir, includePath + ext);
    }

    var template = fs.readFileSync(filePath, 'utf-8');
    var data = options.template_global_data ? this : params.hash;
    data.root = getRoot(includePath);

    template = hbs.compile(template);

    if (typeof params.fn === 'function') {
      data.yield = params.fn(this);
    }

    return new hbs.SafeString(template(data));
  });

  hbs.registerHelper('var', function (varname, options) {
    var htmlString =
      options.fn(this) // generate string
        .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); //trim string
    this[varname] = htmlString.replace(/(\r\n|\n|\r)/gm, '');
    return '';
  });

  var reg_block = /^`{3}(hbs|handlebars)$[\s\S]*?^`{3}$/gm;
  var reg_start = /^`{3}(hbs|handlebars)$/m;
  var reg_end = /^`{3}$/m;

  return _.map(components, function(component) {
    var md = component.md.replace(reg_block, function(codeblock) {
      var code = codeblock.replace(reg_start, '').replace(reg_end, '');

      if (component.config.compile === true) {
        var data = options.template_global_data ? component.config : {};
        code = hbs.compile(code)(data);

        var previewSource = htmlBeautify(code, {
          preserve_newlines: true
        });

        code = htmlBeautify(code, {
          preserve_newlines: false
        });
      }
      var wrapperClassName = options.preview_class;

      if (component.config.fullDisplay === true) {
        wrapperClassName += ' aigis-preview--full';
      }

      if (component.config.customClass) {
        wrapperClassName += ' ' + component.config.customClass;
      }

      return '<div><aigis-code>' + format('<div class="%s"><div class="%s">\n  %s</div>\n\n%s \n</div>', options.code_container_class, wrapperClassName, code, "```hbs\n"+ previewSource +"```") + '</aigis-code></div>';
    });
    component.md = md;
    return component;
  });
}


module.exports = transform;
