/*!
 * monic-loader
 * https://github.com/MonicBuilder/monic-loader
 *
 * Released under the MIT license
 * https://github.com/MonicBuilder/monic-loader/blob/master/LICENSE
 */

var
	$C = require('collection.js').$C;

var
	loaderUtils = require('loader-utils'),
	monic = require('monic');

module.exports = function (source, inputSourceMap) {
	if (this.cacheable) {
		this.cacheable();
	}

	var
		opts = loaderUtils.parseQuery(this.query),
		cb = this.async();

	opts = $C(opts).reduce(function (map, val, key) {
		if ((key === 'flags' || key === 'labels') && typeof val === 'string') {
			map[key] = $C(val.split('|')).reduce(function (map, el) {
				map[el] = true;
				return map;
			}, {});

		} else {
			map[key] = parse(val);
		}

		return map;
	}, {});

	opts.sourceMaps = this.sourceMap;
	opts.inputSourceMap = inputSourceMap;
	opts.content = source;
	opts.saveFiles = false;

	monic.compile(loaderUtils.getRemainingRequest(this), opts, function (err, data, sourceMap) {
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
