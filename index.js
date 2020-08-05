const sass = require('node-sass');



module.exports = (options = {}) => ({ registerFilePlugin }) => {

  registerFilePlugin(options.rule || '**/*.s@(a|c)ss', (path, buffer, next) => {
    // rewrite file extension to .css
    const outputPath = path.split('.').slice(0, -1).concat(['css']).join('.');
    return new Promise((resolve, reject) => {
      sass.render({
        ...options,
        data: buffer.toString('utf8'),
        outFile: outputPath,
      }, (err, result) => {
        if (err) return reject(err);
        resolve(Promise.all([
          next(outputPath, result.css),
          // if there is a sourcemap output that as well
          next(outputPath + '.map', result.map),
        ]));
      })
    });
  });

}
