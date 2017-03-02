var path = require('path');
var _ = require('lodash');

var ASSETS_FOLDER = 'assets';
var OPTIONS = {
  name: 'Styleguide',
  source: [],
  source_type: ['.css', '.sass', '.scss', '.styl'],
  dest: './styleguide-build',
  assets_dest: ASSETS_FOLDER,
  dependencies: [],
  template_dir: './template',
  component_dir: './html',
  timestamp_format: 'YYYY/MM/DD HH:mm',
  template_engine: 'hbs',
  template_ext: {
    hbs: '.hbs',
    handlebars: '.hbs'
  },
  transform: ['html', 'jade', 'ejs', 'hbs'],
  log: false,
  color_palette: true,
  preview_class: 'aigis-preview',
  code_container_class: 'aigis-code',
  output_collection: ['category', 'tag'],
  core_assets_dir: appRoot + '/'+ ASSETS_FOLDER,
  core_template_dir: appRoot + '/template'
};

module.exports = function(basedir) {
  var options = _.assign({}, OPTIONS);
  options.dest = path.join(basedir, options.dest);
  
  options.template_dir = path.join(basedir, options.template_dir);
  options.component_dir = path.join(basedir, options.component_dir);
  return options;
};
