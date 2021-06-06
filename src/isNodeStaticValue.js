function isInitialStateValid(arg){
    if(!arg) {
         return [] 
    }
    if(['NumericLiteral', 'BooleanLiteral', 'StringLiteral'].includes(arg.type)) {
      return [arg.type, arg.value]
    }
    if(arg.type === "TemplateLiteral") {
      if(arg.expressions.length !== 0) {
        return false
      }
      if(arg.quasis.length === 0) {
        return ['StringLiteral', '']
      }
      return ['StringLiteral', arg.quasis[0].value.cooked]
    }
    if(arg.type === 'NullLiteral') {
        return ['Identifier', 'null']
    }
    if(arg.type === 'Identifier') {
      if(['undefined', 'NaN', 'Infinity'].includes(arg.name)) {
        return ['Identifier', arg.name]
      }
      return false
    }
    if(arg.type === 'ObjectExpression') {
      if(arg.properties.length !== 0) {
        return false
      }
      return ['ObjectExpression']
    }
    if(arg.type === 'ArrayExpression') {
      if(arg.elements.length !== 0) {
        return false
      }
      return ['ArrayExpression']
    }
    return false
  }

module.exports = isInitialStateValid