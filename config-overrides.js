module.exports = function override(config, env) {
  if (config.optimization && config.optimization.minimizer) {
    // Remove CSS minimizer completely
    config.optimization.minimizer = config.optimization.minimizer.filter(
      (plugin) => plugin.constructor.name !== 'CssMinimizerPlugin'
    );
  }
  return config;
};
