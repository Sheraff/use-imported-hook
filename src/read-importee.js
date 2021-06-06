const fs = require('fs')
const parser = require('@babel/parser')
const nodePath = require('path')
const traverse = require('@babel/traverse').default
const {
	BABEL_MARKER_COMMENT,
	ACCEPTED_HOOKS,
	STATEFUL_HOOKS,
	HOOKS_WITHOUT_DEPS,
	FORBIDDEN_HOOKS,
	EXTRA_DEPENDENCY_IDENTIFIER_NAME,
	ARRAY_LITERAL_ERROR,
	SPREAD_OPERATOR_ERROR,
	FORBIDDEN_HOOK_ERROR,
} = require('./config')
const isNodeStaticValue = require('./isNodeStaticValue')



const ExtractHooksFromImporteeVisitor = {
	// find hook declaration in importee
	"FunctionDeclaration|ExportDefaultDeclaration"(path) {
		const comment = path.node.leadingComments && path.node.leadingComments.find(
			({value}) => value.includes(BABEL_MARKER_COMMENT)
		)
		if(!comment) {
			return
		}
		this.foundComment = true
		path.traverse({
			CallExpression(path) {
				const name = path.node.callee.name
				if(FORBIDDEN_HOOKS.includes(name)) {
					throw path.buildCodeFrameError(FORBIDDEN_HOOK_ERROR + ': ' + name)
				} else if(ACCEPTED_HOOKS.includes(name)) {
					const dependencies = path.node.arguments[1]
					if(dependencies && dependencies.type === "Identifier") {
						throw path.buildCodeFrameError(ARRAY_LITERAL_ERROR)
					}
					if(dependencies && dependencies.elements.find(el => el.type === "SpreadElement")) {
						throw path.buildCodeFrameError(SPREAD_OPERATOR_ERROR)
					}
					const length = dependencies
						? dependencies.elements.filter(element => element.name !== EXTRA_DEPENDENCY_IDENTIFIER_NAME).length
						: 0
					this.hooks.push({
						type: 'stateless',
						name,
						kind: 'NumericLiteral',
						value: length,
					})
				} else if(HOOKS_WITHOUT_DEPS.includes(name)) {
					this.hooks.push({
						type: 'simple',
						name
					})
				} else if(STATEFUL_HOOKS.includes(name)) {
					const initialState = isNodeStaticValue(path.node.arguments[0])
					if(!initialState) {
						throw path.buildCodeFrameError(STATEFUL_HOOKS_NEED_STATIC_INITIAL_STATE)
					}
					this.hooks.push({
						type: 'stateful',
						name, 
						kind: initialState[0],
						value: initialState[1],
					})
				}
			}
		}, this)
	}
}

function readImportee(importerAbsolutePath, importeeRelativePath, state, parentPath) {
	const directory = nodePath.dirname(importerAbsolutePath)
	const fileAbsolutePath = nodePath.join(directory, importeeRelativePath)
	const codeString = fs.readFileSync(fileAbsolutePath, {encoding: 'utf8'})
	const ast = parser.parse(codeString, {
		sourceType: 'module',
		plugins: ['jsx'],
	})
	traverse(ast, ExtractHooksFromImporteeVisitor, undefined, state, parentPath);
}

module.exports = readImportee
