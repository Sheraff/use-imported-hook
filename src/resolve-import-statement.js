const {
	TOO_MANY_IMPORTS,
} = require('./config')

function findImportArgument(node) {
	if(!node) {
		return
	}
	if (node.callee && node.callee.type === 'Import') {
		return node.arguments[0]
	}
	return findImportArgument(node.callee) || findImportArgument(node.object)
}

function findImportStatementNode(parentPath, state = { import: null }) {
	parentPath.traverse({
		CallExpression(path) {
			const importArg = findImportArgument(path.node)
			if (!importArg) {
				return
			}
			if (this.import && this.import !== importArg) {
				throw path.buildCodeFrameError(TOO_MANY_IMPORTS)
			}
			this.import = importArg
		},
		Identifier(path) {
			const binding = path.scope.getBinding(path.node.name)
			if (!binding || binding.path === parentPath) {
				return
			}
			if (binding.path.type !== "FunctionDeclaration" && binding.path.type !== "VariableDeclarator") {
				return
			}
			this.import = findImportStatementNode(binding.path, this)
		},
	}, state)
	return state.import
}

module.exports = findImportStatementNode