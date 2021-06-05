const readImportee = require('./read-importee')
const {
	BABEL_MARKER_COMMENT,
	EXTRA_DEPENDENCY_IDENTIFIER_NAME,
	ACCEPTED_HOOKS,
  NO_MARKER_ERROR,
  SINGLE_ARGUMENT_ERROR,
} = require('./config')

function transform(babel) {
  const { types: t } = babel

  return {
    name: "find-imported-hooks",
    visitor: {
      // find hook call in importer
      CallExpression(path) {
        if(path.node.callee.name !== 'useImportedHook') {
          return
        }
        const state = { 
          hooks: [],
          foundComment: false,
        }
        // find importee path
        path.traverse({
          CallExpression(path) {
            if(path.node.callee.type !== 'Import') {
              return
            }
            const fileRelativePath = path.node.arguments[0].value
            let program = path
            while(program.type !== "Program") {
              program = program.parentPath
            }
            readImportee(program.hub.file.opts.filename, fileRelativePath, this)
          }
        }, state)

        // throw if imported file doesn't have BABEL_MARKER_COMMENT comment
        if(!state.foundComment) {
          throw path.buildCodeFrameError(NO_MARKER_ERROR)
        }

        // add hooks argument to useImportedHook call
        const reserveHooksArgument = t.arrayExpression()
        state.hooks.forEach(([hookName, depCount]) => {
          const slot = t.arrayExpression()
          slot.elements.push(t.identifier(hookName))
          const dependencyArray = t.arrayExpression()
          dependencyArray.elements.push(...new Array(depCount+1).fill(t.nullLiteral()))
          slot.elements.push(dependencyArray)
          reserveHooksArgument.elements.push(slot)
        })
        path.node.arguments.splice(1, 0, reserveHooksArgument)
        
        // add import declarations to top of document
        let program = path
        while(program && program.type !== "Program") {
          program = program.parentPath
        }
        if(!program) {
          return
        }
        let reactImport = program.node.body.find(
          (node) => node.type === 'ImportDeclaration' && node.source.value.toLowerCase() === 'react'
        )
        if(!reactImport) {
          reactImport = t.importDeclaration([], t.stringLiteral('react'))
          program.node.body.unshift(reactImport)
        }
        state.hooks.forEach(([hookName]) => {
          const alreadyImported = reactImport.specifiers.find(
            specifier => specifier.type === "ImportSpecifier" && specifier.imported.name === hookName
          )
          if(!alreadyImported) {
            const identifier = t.identifier(hookName)
            const specifier = t.importSpecifier(identifier, identifier)
            reactImport.specifiers.push(specifier)
          }
        })
      },

      // find hook declaration in importee
      "FunctionDeclaration|ExportDefaultDeclaration"(path) {
        const comment = path.node.leadingComments && path.node.leadingComments.find(
          ({value}) => value.includes(BABEL_MARKER_COMMENT)
        )
        if(!comment) {
          return
        }
        
        // add function parameter
        const params = path.node.type === 'FunctionDeclaration'
          ? path.node.params
          : path.node.declaration.params
        if(params.length === 0) {
          params.push(t.objectPattern([]))
        }
        if(params.length >= 2 && (params[1].type !== 'Identifier' || params[1].name !== EXTRA_DEPENDENCY_IDENTIFIER_NAME)) {
          throw path.buildCodeFrameError(SINGLE_ARGUMENT_ERROR)
        }
        if(params.length === 1) {
          params.push(t.identifier(EXTRA_DEPENDENCY_IDENTIFIER_NAME))
        }
        
        // add hooks dependency
        path.traverse({
          CallExpression(path) {
            const name = path.node.callee.name
            if(ACCEPTED_HOOKS.includes(name)) {
              if(!path.node.arguments[1]) {
                path.node.arguments[1] = t.arrayExpression()
              }
              const dependencies = path.node.arguments[1]
              if(dependencies.type === "ArrayExpression") {
                const first = dependencies.elements[0]
                if(!first || first.name !== EXTRA_DEPENDENCY_IDENTIFIER_NAME) {
                  dependencies.elements.unshift(t.identifier(EXTRA_DEPENDENCY_IDENTIFIER_NAME))
                }
              }
            }
          }
        })
      },
    }
  }
}

module.exports = transform