exports.builder = {
  'e': {
    alias: 'engine',
    describe: 'choose template engine [ejs, jade, hbs]',
    default: 'hbs'
  }
};

exports.handler = function init(argv) {
  var path = require('path');
  var fs = require('fs-extra');
  var cwd = path.resolve();
  var rootDir = path.join(__dirname, '../..');
  var colors = require('colors/safe');
  
  var assets = [
    {
      src: 'default_config.yml',
      dest: 'styleguide.yml'
    },
    {
      src: 'styleguide-templates',//Copy the core templates
      dest: 'styleguide-templates'
    }
  ];
  
  console.log(colors.blue('Created the following files and directories:'));
  
  assets.forEach(function (asset) {
    var src = asset.src, dest = asset.dest;
    var _path = path.join(rootDir, src);
    var _dest = path.join(cwd, dest);
    
    switch (src) {
      case 'default_config.yml':
        var file = fs.readFileSync(_path, 'utf-8');
        
        try {
          var config = fs.readFileSync(_dest);
          console.warn(colors.yellow('Cowardly refusing to overwrite existing: styleguide.xml'));
        }
        catch (err) {
          console.log(colors.blue(' ', path.relative(cwd, _dest)));
          fs.outputFileSync(_dest, file);
        }
        break;
      default:
        console.log(' ', path.relative(cwd, _dest));
        
        fs.copySync(_path, _dest, {
          filter: function (file) {
            console.log(colors.blue(' ', path.relative(rootDir, file)));
            return true;
          }
        });
    }
  });
};
