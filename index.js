const sass = require('node-sass');



module.exports = (options = {}) => (plugin) => {

  plugin.registerFileHandler(options.rule || '**/*.s@(a|c)ss', ({ path, file }) => {
    // rewrite file extension to .css
    const outputPath = path.split('.').slice(0, -1).concat(['css']).join('.');
    return new Promise((resolve, reject) => {
      sass.render({
        ...options,
        data: file.toString('utf8'),
        outFile: outputPath,
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
