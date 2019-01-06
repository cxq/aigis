var _ = require('lodash');
var path = require('path');
var Promise = require('bluebird');
var glob = require('glob');
var fs = require('fs-extra');

function css(options) {
  var sourcePath = options.source;

  if (_.isArray(sourcePath)) {
    // e.g, source:
    //   - /css
    sourcePath = _(sourcePath)
      .map(function(_path) {
        var ext = path.extname(_path);
        if (ext.length === 0) {
          return _.map(options.source_type, function(ext) {
            return path.normalize(_path + '/**/*' + ext);
          });
        }
        else {
          return _path;
        }
      })
      .flatten()
      .value();
  }
  else {
    if (path.extname(sourcePath).length === 0) {
      // e.g, source: /css
      sourcePath = _.map(options.source_type, function(ext) {
        return path.normalize(sourcePath + '/**/*' + ext);
      });
    }else {
      // e.g, source: ./hoge.css
      sourcePath = [sourcePath];
    }
  }

  var paths = _.flatten(_.map(sourcePath, function(_path) {
    // if not glob pattern comes, just return file path
    if (_path.indexOf('*') === -1 ) {
      return _path;
    }
    return glob.sync(_path);
  }));

  const cleanMap = [];
  const promiseMap = [];

  paths.forEach(function(_path) {
    const pathArray = _path.split(path.sep);
    const pathLength = pathArray.length;

    const relativePath = path.join(path.join(pathArray[pathLength -3], pathArray[pathLength -2], pathArray[pathLength -1]));
    
    // Check if the path has been treated already
    if (!cleanMap.includes(relativePath)) {
      cleanMap.push(relativePath);

      promiseMap.push(new Promise(function(resolve, reject) {
        fs.readFile(_path, function(err, data) {
          if (err) reject();
          resolve({
            contents: data,
            path: _path
          });
        });
      }));
    }

    return false;
  });

  return Promise.all(promiseMap);
}

module.exports = css;
