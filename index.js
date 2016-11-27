'use strict';

/*!
 * monic-loader
 * https://github.com/MonicBuilder/monic-loader
 *
 * Released under the MIT license
 * https://github.com/MonicBuilder/monic-loader/blob/master/LICENSE
 */

const
	$C = require('collection.js/compiled'),
	parent = module.parent;

const
	path = require('path'),
	loaderUtils = require('loader-utils'),
	monic = require('monic');

module.exports = function (source, inputSourceMap) {
	this.cacheable && this.cacheable();

	const
		optsIsObj = /^\?(?:\{|\[)/.test(this.query),
		cb = this.async();

	let
		opts = loaderUtils.parseQuery(this.query);

	opts = $C(opts).reduce((map, val, key) => {
		if ({flags: true, labels: true}[key] && !optsIsObj) {
			map[key] = $C(val.split('|')).reduce((map, el) => {
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

	opts = Object.assign({}, this.options.monic, opts, {
		inputSourceMap,
		sourceMaps: this.sourceMap,
		content: source,
		saveFiles: false
	});

	const files = {};
	opts.replacers = opts.replacers || [];
	opts.replacers.push((content, file) => {
		files[path.normalize(file)] = true;
		return content;
	});

	monic.compile(this.resourcePath, opts, (err, data, sourceMap) => {
		$C(files).forEach((el, file) => this.addDependency(file));
		cb(err, data, sourceMap && sourceMap.map);
	});
};

function toJS(str) {
	return new Function(
		'module',
		'exports',
		'require',
		'__filename',
		'__dirname',
		`return ${str}`

	)(parent, parent.exports, parent.require, parent.filename, path.dirname(parent.filename));
}

function parse(val) {
	try {
		if (typeof val === 'object') {
			$C(val).set((el) => toJS(el));
		}

		return val;

	} catch (ignore) {
		return val;
	}
}
