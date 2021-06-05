const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../');
const path = require('path');
const config = require('../src/config')
const errorTests = []

addErrorTest('importer-missing-importee', /ENOENT: no such file or directory/)
addErrorTest('importee-missing-comment', config.NO_MARKER_ERROR)
addErrorTest('importee-multiple-arguments', config.SINGLE_ARGUMENT_ERROR)
addErrorTest('importee-deps-not-array-literal', config.ARRAY_LITERAL_ERROR)
addErrorTest('importee-deps-spread-operator', config.SPREAD_OPERATOR_ERROR)
addErrorTest('importee-forbidden-hook', new RegExp(config.FORBIDDEN_HOOK_ERROR))

pluginTester({
	plugin,
	pluginName: 'babel-transform-importable-hooks',
	fixtures: path.join(__dirname, 'fixtures'),
	filename: __filename,
	tests: errorTests
})

function addErrorTest(name, error) {
	errorTests.push({
		title: `expected error: ${name}`,
		fixture: `errors/${name}/code.js`,
		error
	})
}