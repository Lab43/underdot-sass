const sass = require('node-sass')
    , p = require('path')
;



module.exports = (config = {}) => (plugin) => {

  const {includePaths = [], ...options} = config;

  plugin.registerFileHandler(options.rule || '**/*.s@(a|c)ss', ({ path, file }) => {
    // skip the file if it starts with an underscore
    if (p.basename(path).startsWith('_')) return {path, file};
    // rewrite file extension to .css
    const outputPath = path.split('.').slice(0, -1).concat(['css']).join('.');
    return new Promise((resolve, reject) => {
      sass.render({
        ...options,
        data: file.toString('utf8'),
        outFile: outputPath,
        includePaths: [p.join(plugin.source, p.dirname(path))].concat(includePaths),
      }, async (err, result) => {
        if (err) return reject(err);
        let output = {path: outputPath, file: result.css};
        if (result.map) {
          output = [output, {path: outputPath + '.map', file: result.map}]
        }
        resolve(output);
      });
    });
  });

}
