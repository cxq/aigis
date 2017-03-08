var path = require('path');
var _ = require('lodash');

var ASSETS_FOLDER = 'assets';
var OPTIONS = {
  name: 'Styleguide',
  source: [],
  source_type: ['.css','.scss','.md'],
  dest: './styleguide-build',
  assets_dest: ASSETS_FOLDER,
  dependencies: [],
  component_dir: './styleguide-templates',
  template_global_data: false,
  timestamp_format: 'YYYY/MM/DD HH:mm',
  template_engine: 'hbs',
  template_ext: {
    hbs: '.hbs',
    handlebars: '.hbs'
  },
  transform: ['html', 'hbs'],
  log: false,
  preview_class: 'aigis-preview',
  code_container_class: 'aigis-code',
  output_collection: ['category', 'tag','dependency'],
  core_assets_dir: appRoot + '/'+ ASSETS_FOLDER,
  core_template_dir: appRoot + '/template',
  helper_options: {
    disable_link_index: true,
    renderTemplateJSON: true
  }
};

module.exports = function(basedir) {
  var options = _.assign({}, OPTIONS);
  options.dest = path.join(basedir, options.dest);
  
  options.component_dir = path.join(basedir, options.component_dir);
  return options;
};
