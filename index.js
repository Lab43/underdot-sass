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
      }, async (err, result) => {
        if (err) return reject(err);
        if (result.map) await next(path + '.map', result.map);
        return next(path, result.css);
      });
    });
  });

}
