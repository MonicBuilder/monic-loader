'use strict';

/*!
 * monic-loader
 * https://github.com/MonicBuilder/monic-loader
 *
 * Released under the MIT license
 * https://github.com/MonicBuilder/monic-loader/blob/master/LICENSE
 */

const dependencyReplacerSettled = Symbol('dependencyReplacerSettled');

const
	$C = require('collection.js/compiled'),
	path = require('path'),
	loaderUtils = require('loader-utils'),
	monic = require('monic');

const optsMap = {
	flags: true,
	labels: true
};

module.exports = function (source, inputSourceMap) {
	const
		optsIsStr = typeof this.query === 'string',
		cb = this.async();

	const opts = $C(loaderUtils.getOptions(this)).reduce((map, val, key) => {
		if (optsMap[key] && optsIsStr) {
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
			map[key] = val;
		}

		return map;
	}, {});

	Object.assign(opts, {
		inputSourceMap,
		sourceMaps: this.sourceMap,
		content: source,
		saveFiles: false
	});

	const files = new Set();
	opts.replacers = opts.replacers || [];
	if (!opts.replacers[dependencyReplacerSettled]) {
		opts.replacers.push((content, file) => {
			files.add(path.normalize(file));
			return content;
		});

		opts.replacers[dependencyReplacerSettled] = true;
	}

	monic.compile(this.resourcePath, opts, (err, data, sourceMap) => {
		files.forEach(file => this.addDependency(file));
		cb(err, data, sourceMap && sourceMap.map);
	});
};
