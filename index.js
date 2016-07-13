/*!
 * monic-loader
 * https://github.com/MonicBuilder/monic-loader
 *
 * Released under the MIT license
 * https://github.com/MonicBuilder/monic-loader/blob/master/LICENSE
 */

var
	$C = require('collection.js/compiled'),
	parent = module.parent;

var
	path = require('path'),
	loaderUtils = require('loader-utils'),
	monic = require('monic');

module.exports = function (source, inputSourceMap) {
	if (this.cacheable) {
		this.cacheable();
	}

	var
		opts = loaderUtils.parseQuery(this.query),
		optsIsObj = /^\?(?:\{|\[)/.test(this.query),
		cb = this.async(),
		that = this;

	opts = $C(opts).reduce(function (map, val, key) {
		if ({flags: true, labels: true}[key] && !optsIsObj) {
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
			map[key] = parse(val);
		}

		return map;
	}, {});

	opts = $C.extend(false, {}, this.options.monic, opts, {
		sourceMaps: this.sourceMap,
		inputSourceMap: inputSourceMap,
		content: source,
		saveFiles: false
	});

	opts.replacers = opts.replacers || [];
	opts.replacers.push(function (content, file) {
		that.addDependency(file);
		return content;
	});

	monic.compile(this.resourcePath, opts, function (err, data, sourceMap) {
		cb(err, data, sourceMap && sourceMap.map);
	});
};

function parse(val) {
	try {
		if (typeof val === 'object') {
			$C(val).forEach(function (el, key) {
				val[key] = new Function(
					'module',
					'exports',
					'require',
					'__filename',
					'__dirname',
					'return ' + el

				)(parent, parent.exports, parent.require, parent.filename, path.dirname(parent.filename));
			});
		}

		return val;

	} catch (ignore) {
		return val;
	}
}
