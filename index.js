/*
 * monic-loader
 * https://github.com/MonicBuilder/monic-loader
 *
 * Released under the MIT license
 * https://github.com/MonicBuilder/monic-loader/blob/master/LICENSE
 */

var
	loaderUtils = require('loader-utils'),
	monic = require('monic');

module.exports = function (source) {
	if (this.cacheable) {
		this.cacheable();
	}

	var
		opts = loaderUtils.parseQuery(this.query),
		cb = this.async();

	opts = Object.keys(opts).reduce(function (accumulator, key) {
		accumulator[key] = parse(opts[key]);
		return accumulator;
	}, {});

	opts.sourceMaps = this.sourceMap;
	opts.content = source;
	opts.saveFiles = false;

	monic(loaderUtils.getRemainingRequest(this), opts, function (err, data, sourceMap) {
		cb(err, data, sourceMap && sourceMap.map);
	});
};

function parse(val) {
	switch (val) {
		case 'true':
			return true;

		case 'false':
			return false;

		default:
			return val;
	}
}
