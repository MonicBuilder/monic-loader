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
		optsIsObj = /^\?(?:\{|\[)/.test(this.query),
		cb = this.async();

	if (!optsIsObj) {
		opts = $C(opts).reduce(function (map, val, key) {
			try {
				if ({flags: true, labels: true}[key]) {
					map[key] = $C(val.split('|')).reduce(function (map, el) {
						if (key === 'labels') {
							map[el] = true;

						} else {
							el = el.split(':');
							map[el[0]] = el[1] || true;
						}

						return map;
					}, {});

				} else {
					map[key] = eval('(' + val + ')');
				}

			} catch (ignore) {
				map[key] = val;
			}

			return map;
		}, {});
	}

	opts.sourceMaps = this.sourceMap;
	opts.inputSourceMap = inputSourceMap;
	opts.content = source;
	opts.saveFiles = false;

	monic.compile(loaderUtils.getRemainingRequest(this), opts, function (err, data, sourceMap) {
		cb(err, data, sourceMap && sourceMap.map);
	});
};
