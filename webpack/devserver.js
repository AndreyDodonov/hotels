

module.exports = function () {
	return {
		devServer: {
			publicPath: '/',
			stats: 'errors-only',
			port: 9000,
			overlay: true
		}
	}
}; 
