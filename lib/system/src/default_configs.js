var path = require('path');
var _ = require('lodash');
var appRoot = require('app-root-dir');

var OPTIONS = {
  name: 'Styleguide',
  source: [],
  source_type: ['.css', '.sass', '.scss', '.styl'],
  dest: './styleguide',
  dependencies: [],
  template_dir: './template',
  component_dir: './html',
  timestamp_format: 'YYYY/MM/DD HH:mm',
  template_engine: 'ejs',
  template_ext: {
    ejs: '.ejs',
    jade: '.jade',
    hbs: '.hbs',
    handlebars: '.hbs'
  },
  transform: ['html', 'jade', 'ejs', 'hbs'],
  log: false,
  color_palette: true,
  preview_class: 'aigis-preview',
  output_collection: ['category', 'tag'],
  core_assets_dir: './assets',
  core_template_dir: appRoot.get() + '/template'
};

module.exports = function(basedir) {
  var options = _.assign({}, OPTIONS);
  options.dest = path.join(basedir, options.dest);
  
  options.template_dir = path.join(basedir, options.template_dir);
  options.component_dir = path.join(basedir, options.component_dir);
  return options;
};
